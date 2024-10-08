const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = {
    create,
    delete: _delete,
    update,
    getAll,
    getProjectById,
    getAllProjects
};


async function authenticate({ username, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.Company.findAll();
}

async function getProjectById(id) {
    return await getProject(id);
}

async function getAllProjects(params){
    return await db.Project.findAll({
        where : { companyId: params.companyId}
    });
}

async function create(params) {
    // validate
    /*if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }*/

    // save user
    return await db.Project.create(params);
    //return await db.Company.findOne({where : {companyName: params.companyName, zip: params.zip}}); 
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const company = await getCompany(id);
    await company.destroy();
}

// helper functions

async function getProject(id) {
    const project = await db.Project.findByPk(id);
    if (!project) throw 'Project not found';
    return project;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}