var express = require('express');
var router = express.Router();
var model = require('../models/model');

/* GET users listing. */
function isMemberLoggingIn(req) {
    return req.session.type == 'member';
}
router.get('/', function(req, res, next) {
    if (isMemberLoggingIn(req))
        res.redirect('/member/dashboard');
    else {
        res.redirect('/member/login');
    }
});
router.get('/login', function(req, res, next) {
    if (isMemberLoggingIn(req))
        res.redirect('/member/dashboard');
    else {
        res.render('./member/login', { title: "Thành viên", userType: req.session.type });
    }
});
router.post('/login', async function(req, res, next) {
    if (isMemberLoggingIn(req))
        res.redirect('/member/dashboard');
    else {
        let user = await model.loginMember(req.body.user_name, req.body.password);
        if (!user) {
            res.json(false);
        } else {
            console.log('Log in successfully');
            req.session.userId = user.id;
            console.log('userId = ' + user.id);
            req.session.user = user;
            req.session.type = 'member';
            res.json(true);
        }
    }
});

router.get('/dashboard/', function(req, res, next) {
    if (isMemberLoggingIn(req)) {
        res.render('./member/dashboard', { title: "Thành viên", userType: req.session.type })
    } else {
        res.redirect('/member/login');
    }
});
module.exports = router;