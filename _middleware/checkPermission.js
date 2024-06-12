const { expressjwt: jwt } = require("express-jwt");

const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = checkPermission;


function checkPermission() {
    return [
        async (req, res, next) => {
            // get user with id from token 'sub' (subject) property
            //console.log(req.user);
            const user = await db.User.findByPk(req.body.id);
            //const userVal = JSON.stringify(user);
            const perm = JSON.parse(user.dataValues.permission);
            var isAuthorized = false;
            console.log(typeof perm);
            console.log(perm["permission"]);
            //console.log(user.dataValues.permission);
            // check user still exists
            if (!user){
                return res.status(401).json({ message: 'Unauthorized' });
            }
            // only authorization is handled here, read and write access is handled at the UI level
            if(perm){
            perm['permission'].forEach(element => {
                console.log(Object.keys(element));
                if(Object.keys(element).includes('compId')){
                    console.log('in');
                if(element['compId'] == user.dataValues.companyId.toString() && element['level'] == 'read'){
                    isAuthorized = true;
                }else if(element['compId'] == user.dataValues.companyId.toString() && element['level'] == 'write'){
                    console.log('inn');
                    isAuthorized = true;}}
                if(Object.keys(element).includes('projId')){
                    if(element['projId'] == req.body.projectId.toString() && element['level'] == 'read'){
                    isAuthorized = true;
                    }else if(element['projId'] == req.body.projectId.toString() && element['level'] == 'write'){
                    isAuthorized = true;}}
                if(Object.keys(element).includes('bidId')){
                if(element['bidId'] == req.body.bidId.toString() && element['level'] == 'read'){
                    isAuthorized = true;
                }else if(element['bidId'] == req.body.bidId.toString() && element['level'] == 'write'){
                    isAuthorized = true;
                }}
            });}
            if(!isAuthorized){
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}