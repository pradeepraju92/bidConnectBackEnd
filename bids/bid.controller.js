const express = require('express');
const _router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const bidService = require('./bid.service');
// Replace the uri string with your MongoDB deployment's connection string.


// routes
_router.post('/authenticate', authenticateSchema, authenticate);
_router.post('/register', registerSchema, register);
_router.get('/getAll',  getAll);
_router.get('/current', authorize(), getCurrent);
_router.get('/:id', getCompanyById);
_router.put('/:id', authorize(), updateSchema, update);
_router.delete('/:id', _delete);
_router.post('/insertProject', insertProject);

module.exports = _router;

function insertProject(req,res,next){
    bidService.insertDoc(req.body)
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
        projectId: Joi.string().required()
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

function getCompanyById(req, res, next) {
    companyService.getCompanyById(req.params.id)
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