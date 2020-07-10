var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utility = require('./utility');

var JsonToCsv = require('json2csv');
var fs = require('fs');
/* GET users listing. */
function isManagerLoggingIn(req) {
    return req.session.type == 'manager';
}
router.get('/', function(req, res, next) {
    if (isManagerLoggingIn(req))
        res.redirect('/manager/dashboard');
    else {
        res.redirect('/manager/login');
    }
});
router.get('/login', function(req, res, next) {
    if (isManagerLoggingIn(req))
        res.redirect('/manager/dashboard');
    else {
        res.render('./manager/login', { title: "Quản lí", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (isManagerLoggingIn(req))
        res.redirect('/manager/dashboard');
    else {
        let user = await utility.Manager.login(req.body.user_name, req.body.password);
        if (!user) {
            res.json(false);
        } else {
            console.log('Log in successfully');
            req.session.userId = user.id;
            console.log('userId = ' + user.id);
            req.session.user = user;
            req.session.type = 'manager';
            res.json(true);
        }
    }
});

router.get('/dashboard', function(req, res, next) {
    if (isManagerLoggingIn(req)) {
        res.render('./manager/dashboard', { title: "Quản lí", h1: "Smart Food Court System", p: "Trang dành cho Quản lí", userType: req.session.type })
    } else {
        res.redirect('/manager/login');
    }
});

router.get('/manage-screen', function(req, res, next) {

});

//get report
router.get('/report', async function(req, res){
    if (isManagerLoggingIn(req)){
        let report = await utility.Manager.getReport();

        const csv = await JsonToCsv.parse(report, {fields : ['id', 'name', 'count', 'date', 'amount']});

        fs.writeFile('report.csv', csv, function(err){
            if (err) console.log(err);
        });
        console.log(report);
        try {
            res.render('./report' , {title: "Thống kê", report : report});
        } catch (error) {
            console.log(error);
        }
    }
    else {
        res.redirect('/manager/login');
    }
});

router.get('/download', async function (req, res) {
    res.download('./report.csv', 'report.csv');
})
module.exports = router;