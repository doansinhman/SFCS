var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utility = require('./utility');

var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs');

/* GET users listing. */

router.get('/', function(req, res, next) {
    if (req.session.type) {
        res.render('info', { title: "Thông tin tài khoản", userType: req.session.type });
    } else {
        res.writeHead(404);
        res.end('Login first.');
    }
});

router.post('/get', async function(req, res, next) {

    switch (req.session.type) {
        case "cashier":
            let cashier = new utility.Cashier(req.session.user);
            delete cashier.password;
            res.json(cashier);
            break;
        case "cook":
            break;
        case "manager":
            break;
        case "member":
            let member = new utility.Member(req.session.user);
            delete member.password;
            res.json(member);
            break;
        case "screen":
            break;
        case "vendor":
            break;
        default:
            //
            res.json(null);
            break;
    }
});
module.exports = router;