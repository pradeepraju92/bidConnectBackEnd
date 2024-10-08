﻿const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = {
    authenticate,
    getAll,
    getAllInComp,
    getById,
    create,
    update,
    delete: _delete,
    updateCompany,
    updateJob
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
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
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

async function getAllInComp(params){
    const user = await db.User.findAll({ where: {companyId:params['companyId']}});
    if (!user) throw 'User not found';
    return user;
}

async function updateCompany(username,params){
    const user = await db.User.findOne({ where: {username:username}});
    user.set({companyId: params.companyList});
    user.save();
}

async function updateJob(username,params){
    const user = await db.User.findOne({ where: {username:username}});
    user.set({jobId: params.jobTitle});
    user.set({phone: params.phone});
    if(params.jobTitle == 2){
        const ownerPerm = '{"permission":[{"compId":"' + params.companyId + '","level":"write"}]}';
        user.set({permission:ownerPerm});
    }
    user.save();
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}