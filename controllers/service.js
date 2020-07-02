var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utility = require('./utility');
/* 
var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs'); */

/* GET users listing. */
function isCookLoggingIn(req) {
    return req.session.type == 'cook';
}
router.post('/get', async function(req, res, next) {
    if (isCookLoggingIn(req)) {
        res.json(await utility.Service.getFoodsNeedToServiceOfVendor(req.session.user.court_id));
    } else {
        res.json(null);
    }
});

module.exports = router;