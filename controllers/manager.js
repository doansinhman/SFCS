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

function getAllUserByType(type)
{
    return model.getUsersByType(type);
}
// API listing
///////////////////////////////////////////////////////////////////
router.post('/api/GetMember', async function(req, res, next)
{
    let scr = await getAllUserByType('member');
    if (isManagerLoggingIn(req))
    {
        scr.forEach(user => {
            user.password = '';
        });
        res.json(scr);
    }            
    else console.log('Unauthorize!');
})
router.post('/api/DeleteMember', async function(req, res, next)
{
    let scr = await getAllUserByType('member');
    if (isManagerLoggingIn(req))
    {
        scr.forEach(user => {
            user.password = '';
        });
        res.json(scr);
    }            
    else 
    {
        res.json(false);
    }
})
///////////////////////////////////////////////////////////////////////////
router.get('/', function(req, res, next) {
    console.log(req);
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
        res.render('./manager/dashboard', { title: "Quản lí" , plt: "none",userType: req.session.type })
    } else {
        res.redirect('/manager/login');
    }
});

router.get('/manage-screen', function(req, res, next) {
    if (isManagerLoggingIn(req)) {
        res.render('./manager/dashboard', { title: "Quản lí Screen", plt: 'screen', userType: req.session.type })
    } else {
        res.redirect('/manager/login');
    }
});
router.get('/manage-vendor', function(req, res, next) {
    if (isManagerLoggingIn(req)) {
        res.render('./manager/dashboard', { title: "Quản lí nhà cung cấp", plt: 'vendor',  userType: req.session.type })
    } else {
        res.redirect('/manager/login');
    }
});
router.get('/manage-cashier', function(req, res, next) {
    if (isManagerLoggingIn(req)) {
        res.render('./manager/dashboard', { title: "Quản lí thu ngân", plt:'cashier',  userType: req.session.type })
    } else {
        res.redirect('/manager/login');
    }
});
router.get('/manage-cook', function(req, res, next) {
    if (isManagerLoggingIn(req)) {
        res.render('./manager/dashboard', { title: "Quản lí đầu bếp", plt:'cook', userType: req.session.type })
    } else {
        res.redirect('/manager/login');
    }
});

router.get('/manage-member', async function(req, res, next) {
    
    if (isManagerLoggingIn(req)) {
        
        res.render('./manager/dashboard', { title: "Quản lí thành viên", plt: 'member', userType: req.session.type })
    } else {
        res.redirect('/manager/login');
    }
});

router.get('/report', function(req, res, next) {
    if (isManagerLoggingIn(req)) {
        res.render('./manager/dashboard', { title: "Lấy báo cáo", plt: 'getReport', userType: req.session.type })
    } else {
        res.redirect('/manager/login');
    }
});

module.exports = router;