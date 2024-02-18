const express = require('express');
const _router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const vendorBidInviteService = require('./vendorBidInvite.service');

// routes
_router.post('/authenticate', authenticateSchema, authenticate);
_router.post('/register', registerSchema, register);
_router.post('/bulkRegister', registerBulkSchema, bulkRegister);
_router.get('/getAll',  getAll);
_router.get('/listByBidId/:id', listByBidId);

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
        email: Joi.string().required(),
        lastInviteSentAt: Joi.date().required(),
        bidId: Joi.number().required(),
        inviteAccepted: Joi.string(),
    });
    validateRequest(req, next, schema);
}

function registerBulkSchema(req, res, next) {
    const schema = Joi.array().items(Joi.object({
        email: Joi.string().required(),
        lastInviteSentAt: Joi.date().required(),
        bidId: Joi.number().required(),
        inviteAccepted: Joi.string(),
    }));
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    vendorBidInviteService.create(req.body)
        .then(invite => res.json(invite))
        .catch(next);
}

function bulkRegister(req, res, next) {
    vendorBidInviteService.bulkCreate(req.body)
        .then(invite => res.json(invite))
        .catch(next);
}

function getAll(req, res, next) {
    vendorBidInviteService.getAll()
        .then(invite => res.json(invite))
        .catch(next);
}

function listByBidId(req, res, next) {
    vendorBidInviteService.listByBidId(req.params.id)
        .then(invite => res.json(invite))
        .catch(next);
}
