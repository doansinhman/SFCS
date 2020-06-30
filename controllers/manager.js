var express = require('express');
var router = express.Router();
var model = require('../models/model');

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
        let user = await model.loginManager(req.body.user_name, req.body.password);
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
module.exports = router;