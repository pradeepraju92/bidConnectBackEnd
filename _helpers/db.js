const { MongoClient } = require("mongodb");
const tedious = require('tedious');
const { Sequelize } = require('sequelize');

const { dbName, dbConfig } = require('config.json');


module.exports = db = {};

initialize();

async function initialize() {
    const dialect = 'mssql';
    const host = dbConfig.server;
    const { userName, password } = dbConfig.authentication.options;

    // create db if it doesn't already exist
    await ensureDbExists(dbName);

    // connect to db
    const sequelize = new Sequelize(dbName, userName, password, { host, dialect });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);
    db.Company = require('../companyDetails/company.model')(sequelize);
    db.Job = require('../jobDesc/job.model')(sequelize);
    db.Project = require('../project/project.model')(sequelize);
    db.Bid = require('../bids/bid.model')(sequelize);
    db.VendorBidInvite = require('../vendorBidInvite/vendorBidInvite.model')(sequelize);

    // sync all models with database
    await db.User.sync({ alter: true });
    await db.Company.sync({alter: true});
    await db.Job.sync({alter:true});
    await db.Project.sync({alter:true});
    await db.Bid.sync({alter:true});
    await db.VendorBidInvite.sync({alter:true});
    //await sequelize.sync({ alter: true });
    //insert default values for job description
    //await insertIntoJob();
}

async function insertIntoJob(){
    const jobDetails =  await db.Job.bulkCreate([
        {jobDesc: 'Owner' ,canSeeBids:0 ,canSubmitProjects:0},
        {jobDesc: 'Project Manager' ,canSeeBids:0 ,canSubmitProjects:0},
        {jobDesc: 'Project Engineer' ,canSeeBids:0 ,canSubmitProjects:0},
        {jobDesc: 'Procurement Head' ,canSeeBids:0 ,canSubmitProjects:0},
        {jobDesc: 'Procurement Manager' ,canSeeBids:0 ,canSubmitProjects:0},
        {jobDesc: 'Technical Advisor' ,canSeeBids:0 ,canSubmitProjects:0},
        {jobDesc: 'Other' ,canSeeBids:0 ,canSubmitProjects:0}
    ]);
}

async function ensureDbExists(dbName) {
    return new Promise((resolve, reject) => {
        const connection = new tedious.Connection(dbConfig);
        connection.connect((err) => {
            if (err) {
                console.error(err);
                reject(`Connection Failed: ${err.message}`);
            }

            const createDbQuery = `IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${dbName}') CREATE DATABASE [${dbName}];`;
            const request = new tedious.Request(createDbQuery, (err) => {
                if (err) {
                    console.error(err);
                    reject(`Create DB Query Failed: ${err.message}`);
                }

                // query executed successfully
                resolve();
            });

            connection.execSql(request);
        });
    });
}
