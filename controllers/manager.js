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
function findMember(user_name)
{
    return model.findMember(user_name);
}
function deleteStaff(user_name, type)
{
    return model.deleteStaff(user_name, type);
}
function addStaff(type, data)
{
    var creator;
    var d = JSON.parse(data);
    switch (type)
    {
        case "cook":
            creator = model.createCook;
            break;
        case "vendor":
            creator = model.createVendor;
            break;
        case "cashier":
            creator = model.createCashier;
            break;
        case "screen":
            creator = model.createScreen;
            break;
        default: return "Not a valid Staff type"

    }
    return creator(d);
}
// API listing
///////////////////////////////////////////////////////////////////
// GetMember()
router.get('/api/GetMember', async function(req, res, next)
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
});

// DeleteMember(user_name);
router.post('/api/DeleteMember', async function(req, res, next)
{
    if (isManagerLoggingIn(req))
    {
        var user_name = req.body.user_name;
        var found = await findMember(user_name)
        if(found)
        {
            console.log(user_name);
            model.deleteMember(user_name).then(result => res.json(result));
        }
        else
            res.json(false);
    }            
    else 
    {
        console.log('Unauthorize!');
        res.write('Unauthorize!')
    }
});
// Force ChangePass(user_name, newpass)
router.post('/api/ForceChangePass', async function(req, res, next)
{
    if (isManagerLoggingIn(req))
    {
        model.forceChangePass(req.body.user_name, req.body.type, req.body.new_pass)
        .then(
            result => res.json(result)
        );
    }            
    else 
    {
        console.log('Unauthorize!');
        res.write('Unauthorize!');
    }
})
// Get Staff information
router.get('/api/GetStaffs', async function(req, res, next)
{
    if (isManagerLoggingIn(req))
    {
        user = await getAllUserByType(req.query.ty);
        res.json(user);
    }
    else res.write('Unauthorize!')
})
// Delete Staff
router.post('/api/DeleteStaff', async function (req, res, next) 
{
    if (isManagerLoggingIn(req))
    {
        status = await deleteStaff(req.body.user_name, req.body.type);
        res.json(status);
    }
    else res.write('Unauthorize!')
})
// Add Staff
router.post('/api/AddStaff', async function(req, res, next)
{
    if (isManagerLoggingIn(req))
    {
        status = await addStaff(req.body.type, req.body.data);
        res.json(status);
    }
    else res.write('Unauthorize!')
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

router.get('/report', async function(req, res, next) {
    if (isManagerLoggingIn(req)) {
        let report = await utility.Vendor.getReport(-1);

        const csv = await JsonToCsv.parse(report, { fields: ['id', 'name', 'count', 'date', 'amount'] });

        fs.writeFile('report.csv', csv, function(err) {
            if (err) console.log(err);
        });
        //console.log(report);
        try {
            res.render('./report', { title: "Thống kê", report: report });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/manager/login');
    }
});

module.exports = router;