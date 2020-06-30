var express = require('express');
var router = express.Router();
var model = require('../models/model');

var formidable = require('formidable');
var mv = require('mv');


/* GET users listing. */
function isVendorLoggingIn(req) {
    return req.session.type == 'vendor';
}
router.get('/', function(req, res, next) {
    if (isVendorLoggingIn(req))
        res.redirect('/vendor/dashboard');
    else {
        res.redirect('/vendor/login');
    }
});
router.get('/login', function(req, res, next) {
    if (isVendorLoggingIn(req))
        res.redirect('/vendor/dashboard');
    else {
        res.render('./vendor/login', { title: "Nhà cung cấp", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (isVendorLoggingIn(req))
        res.redirect('/vendor/dashboard');
    else {
        let user = await model.loginVendor(req.body.user_name, req.body.password);
        if (!user) {
            res.json(false)
        } else {
            console.log('Log in successfully');
            req.session.userId = user.id;
            console.log('userId = ' + user.id);
            req.session.user = user;
            req.session.type = 'vendor';

            res.json(true);
        }
    }
});

router.get('/dashboard/', function(req, res, next) {
    if (isVendorLoggingIn(req)) {
        res.render('./vendor/dashboard', { title: "Nhà cung cấp", h1: "Smart Food Court System", p: "Trang dành cho nhà cung cấp", userType: req.session.type })
    } else {
        res.redirect('/vendor/login');
    }
});

router.get('/menu/', function(req, res, next) {
    if (isVendorLoggingIn(req)) {
        res.render('./vendor/menu', { title: "Nhà cung cấp", userType: req.session.type })
    } else {
        res.redirect('/vendor/login');
    }
});

router.post('/menu/', async function(req, res, next) {
    //create new food
    if (isVendorLoggingIn(req)) {
        var form = new formidable.IncomingForm();
        form.parse(req, async function(err, fields, files) {
            if (fields.name && fields.price && fields.type && fields.description) {
                let ret = await model.createFood(fields, req.session.userId);
                if (!ret.success) {
                    res.redirect('/vendor/menu');
                } else {
                    console.log('uploading');
                    var oldpath = files.fileToUpload.path;
                    var newpath = './public/images/food/' + ret.id + '.jpg';
                    mv(oldpath, newpath, function(err) {
                        if (err) throw err;
                        res.redirect('/vendor/menu');
                    });
                }
            } else {
                res.redirect('/vendor/menu');
            }
        });
    } else {
        res.redirect('/vendor/login');
    }
});

module.exports = router;