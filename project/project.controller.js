const express = require('express');
const _router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const projectService = require('./project.service');

// routes
_router.post('/authenticate', authenticateSchema, authenticate);
_router.post('/register', registerSchema, register);
_router.get('/getAll',  getAll);
_router.get('/current', authorize(), getCurrent);
_router.get('/:id', getProjectById);
_router.post('/getAllProjectForCompany', getProjectByCompany);
_router.put('/:id', authorize(), updateSchema, update);
_router.delete('/:id', _delete);

module.exports = _router;

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
        internalId: Joi.string(),
        title: Joi.string().required(),
        size: Joi.string().required(),
        jobWalkDate: Joi.string(),
        jobName1: Joi.string(),
        jobNo1: Joi.string(),
        jobName2: Joi.string(),
        jobNo2: Joi.string(),
        companyId: Joi.number().required(),
        desc: Joi.string().required(),
        isPublic: Joi.boolean(),
        isPrivate: Joi.boolean(),
        clName: Joi.string(),
        clProjLead: Joi.string(),
        clDueDate: Joi.string(),
        clNotes: Joi.string()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    projectService.create(req.body)
        .then(company => res.json(company))
        .catch(next);
}

function getProjectByCompany(req,res,next){
    projectService.getAllProjects(req.body)
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

function getProjectById(req, res, next) {
    projectService.getProjectById(req.params.id)
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