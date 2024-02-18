const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    getByBidId,
    listByBidId,
    bulkCreate
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
    return await db.VendorBidInvite.findAll();
}

async function create(params) {
    return await db.VendorBidInvite.create(params);
}

async function bulkCreate(paramsArray) {
    //MSSQL does not support updateonduplicate key. Need to find better ways to make batch/bulk queries to DB
    let resultArray = [];
    for(let i = 0 ; i < paramsArray.length; i++) {
        resultArray.push(await db.VendorBidInvite.upsert(paramsArray[i]));
    }
    return resultArray;
}


// helper functions

async function getByBidId(id) {
    const invite = await db.VendorBidInvite.findOne({ where: { bidId: id } });
    return invite;
}

async function listByBidId(bidIdsArray) {
    const invite = await db.VendorBidInvite.findAll({ where: { bidId: {in : bidIdsArray} } });
    return invite;
}


function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}