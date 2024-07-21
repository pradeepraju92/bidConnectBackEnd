const express = require('express');
const _router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const bidService = require('./bid.service');
// Replace the uri string with your MongoDB deployment's connection string.
const multer = require("multer");
//const multer_blob = require("multer-azure-blob-storage");
const multerAzure = require('multer-azure')

//storage options for file upload
/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({
    storage,
    limits: {
      fileSize: 1000000 // 1MB
    }
  });
  //storage options for azure file upload
  const azureStorage = multer_blob.MulterAzureStorage({
    connectionString: 'DefaultEndpointsProtocol=https;AccountName=xtnsitenderstorage;AccountKey=s59LrY1SN98NJEctYlTmAOgeLudjG8setQd0bpKDiDquSgeh0FC6t4hbFP+iN3h+quxEZXCOkxCL+AStJHZnBA==;EndpointSuffix=core.windows.net',
    accessKey: 's59LrY1SN98NJEctYlTmAOgeLudjG8setQd0bpKDiDquSgeh0FC6t4hbFP+iN3h+quxEZXCOkxCL+AStJHZnBA==',
    accountName: 'xtnsitenderstorage',
    containerName: 'uploads',
    urlExpirationTime: 60
  });

  const upload = multer({
    storage: azureStorage
    });*/
    const upload = multer({ 
        storage: multerAzure({
          connectionString: 'DefaultEndpointsProtocol=https;AccountName=xtnsitenderstorage;AccountKey=s59LrY1SN98NJEctYlTmAOgeLudjG8setQd0bpKDiDquSgeh0FC6t4hbFP+iN3h+quxEZXCOkxCL+AStJHZnBA==;EndpointSuffix=core.windows.net', //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
          account: 'xtnsitenderstorage', //The name of the Azure storage account
          key: 's59LrY1SN98NJEctYlTmAOgeLudjG8setQd0bpKDiDquSgeh0FC6t4hbFP+iN3h+quxEZXCOkxCL+AStJHZnBA==', //A key listed under Access keys in the storage account pane
          container: 'uploads',  //Any container name, it will be created if it doesn't exist
          blobPathResolver: function(req, file, callback){
            var blobPath = extractFileName(req, file); //Calculate blobPath in your own way.
            callback(null, blobPath);
          }
        })
      });



// routes
_router.post('/authenticate', authenticateSchema, authenticate);
_router.post('/register', registerSchema, register);
_router.get('/getAll',  getAll);
_router.get('/current', authorize(), getCurrent);
_router.get('/:id', getBidById);
_router.get('/:projectId/:bidId/:schemaType',getProjectDoc);
_router.post('/getAllProjectDoc', getAllProjectDoc);
_router.delete('/:id', _delete);
_router.post('/insertDoc', insertDoc);
_router.post('/sendEmail', sendEmail);
_router.post('/getBidByProject', getBidByProject);
_router.post('/listBidDetailByProject', listBidDetailByProject);
_router.post('/getVendorById', getSubmittedVendorById);
_router.post('/getFileList', getFileList);
_router.post('/updateRev', updateRev);
_router.post('/uploadFile', upload.single('files'),function(req,res,next){
    bidService.uploadFile(req)
    .then(user => res.json(user))
    .catch(next);
});

module.exports = _router;

function extractFileName(req,file){
    return file['originalname'];
}

function sendEmail(req,res,next){
    bidService.sendEmail(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function getSubmittedVendorById(req,res,next){
    bidService.getSubmittedVendorById(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function getBidByProject(req,res,next){
    bidService.getBidByProject(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function getFileList(req,res,next){
    //console.log(req);
    bidService.getFileList(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function updateRev(req,res,next){
    //console.log(req);
    bidService.updateRev(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function listBidDetailByProject(req,res,next){
    //TODO get more columns from other models to show in bid listing page.
    bidService.getBidByProject(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function insertDoc(req,res,next){
    bidService.insertDoc(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function getAllProjectDoc(req,res,next){
    bidService.getAllProjectDoc(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        keywords: Joi.string().required(),
        companyId: Joi.string().required(),
        projectId: Joi.string().required(),
        pkgLead: Joi.string(),
        pkgCost: Joi.string(),
        pkgInstructions: Joi.string(),
        bidDueDate: Joi.string(),
        bidWalkDate: Joi.string(),
        rfiDueDate: Joi.string(),
        bidContactName: Joi.string(),
        bidPhone: Joi.string(),
        bidEmail: Joi.string(),
        revisionNo: Joi.string()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    bidService.create(req.body)
        .then(company => res.json(company))
        .catch(next);
}

function getAll(req, res, next) {
    companyService.getAll()
        .then(company => res.json(company))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getBidById(req, res, next) {
    bidService.getBidById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function getProjectDoc(req, res, next) {
    bidService.getProjectDoc(req.params.projectId,req.params.bidId,req.params.schemaType)
        .then(user => res.json(user))
        .catch(next);
}


function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}