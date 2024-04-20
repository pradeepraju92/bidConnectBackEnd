const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { secret } = require('config.json');
const db = require('_helpers/db');
const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1";
const mongoClient = new MongoClient(uri);
const fs = require('fs');
const fsp = require('fs/promises');

module.exports = {
    create,
    delete: _delete,
    getAll,
    getBidById,
    insertDoc,
    sendEmail,
    getProjectDoc,
    getBidByProject,
    getSubmittedVendorById,
    uploadFile,
    getFileList
};

async function sendEmail(params){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '10tenders.business@gmail.com',
          pass: 'gacvyubcodqptdir'
        }
      });
      
      var mailOptions = {
        from: '10tenders.business@gmail.com',
        to: params.email,
        subject: params.subject,
        text: params.body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
async function insertDoc(doc){
        const database = mongoClient.db("TenTenders")
        const project = database.collection("project");
        const filter = {_schemaType:doc['_schemaType'],_projectId:doc['_projectId'],_bidId:doc['_bidId']};
        const options = {upsert: true};
        const result = await project.updateOne(filter,{$set: doc},options);
        return result;
        //return await project.insertOne(doc);
}

async function uploadFile(params){
    var oldPath='./uploads/' + params['file']['originalname'];
    var newPath='./files/' + params['body']['projectId'] + '/' + params['body']['bidId'] + '/' + params['file']['originalname'];
    var dir='./files/' + params['body']['projectId'] + '/' + params['body']['bidId'];
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!')
      })
    console.log(params['body']['bidId']);
    return {}
}

async function getSubmittedVendorById(params){
    const resArray = [];
    const database = mongoClient.db("TenTenders")
    const project = database.collection("project");
    const query = { "_bidId":params.bidId,"_projectId":params.projectId,"_schemaType":"vendor"};
    const result = await project.find(query);
    if ((await project.countDocuments(query)) === 0) {
        return {}
      }
      for await(const doc of result){
        resArray.push(doc);
      }
    return resArray;
}


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

async function getBidById(id) {
    return await getBid(id);
}

async function getBidByProject(params) {
    return await db.Bid.findAll({
        where : { projectId: params.id }
    });
}

async function getFileList(params) {
    var fileList = [];
    //console.log(params);
    const folder = './files/' + params['projectId'] + '/' + params['bidId'] + '/';
    console.log(folder);
    return await fsp.readdir(folder);
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
    return await db.Bid.create(params);
    //return await db.Company.findOne({where : {companyName: params.companyName, zip: params.zip}}); 
}


async function _delete(id) {
    const company = await getCompany(id);
    await company.destroy();
}

// helper functions

async function getBid(id) {
    const bid = await db.Bid.findByPk(id);
    if (!bid) throw 'Bid not found';
    return bid;
}


async function getProjectDoc(projectId,bidId,schemaType) {
    const database = mongoClient.db("TenTenders")
    const project = database.collection("project");
    const query = {_schemaType:schemaType,_projectId:projectId,_bidId:bidId}
    const result = await project.findOne(query);
    return result;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}


function logVendorInvite(params) {
    db.VendorBidInvite.create(params);
}