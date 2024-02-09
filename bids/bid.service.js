const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { secret } = require('config.json');
const db = require('_helpers/db');
const { MongoClient } = require('mongodb');
const uri = "";
const mongoClient = new MongoClient(uri);
module.exports = {
    create,
    delete: _delete,
    getAll,
    getCompanyById,
    insertDoc,
    sendEmail
};
async function sendEmail(params){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '10tenders.business@gmail.com',
          pass: ''
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
    //try{
        const database = mongoClient.db("TenTenders")
        const project = database.collection("project");
        const result = await project.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    //}
    /*finally{
        await client.close();
    }*/
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

async function getCompanyById(id) {
    return await getCompany(id);
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

async function getCompany(id) {
    const company = await db.Company.findByPk(id);
    if (!company) throw 'Company not found';
    return company;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}