var express = require('express');
var router = express.Router();
var model = require('../models/model');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'SFCS',
        h1: "Smart Food Court System",
        p: "Khu ẩm thực hiện đại ở khuôn viên Đại học Bách Khoa với thực phẩm sạch, an toàn mang đến cho khách hàng sự tiện lợi.",
        userType: req.session.type
    });
});
router.get('/about', function(req, res, next) {
    res.render('about', {
        userType: req.session.type
    });
});
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err)
            console.log(err);
    })
    res.redirect('/');
});

router.get('/menu', function(req, res, next) {
    res.render('menu', {
        title: 'Thực đơn',
        userType: req.session.type
    });
});

router.get('/dashboard', function(req, res, next) {
    if (req.session.type) {
        res.redirect('/' + req.session.type + '/dashboard');
    } else {
        res.writeHead(404);
        res.end('Login first.');
    }
});

router.use('/member', require('./member'));
router.use('/cashier', require('./cashier'));
router.use('/vendor', require('./vendor'));
router.use('/manager', require('./manager'));
router.use('/cook', require('./cook'));
router.use('/signup', require('./signup'));
router.use('/screen', require('./screen'));
router.use('/order', require('./order'));
router.use('/info', require('./info'));

//for some POST request
router.use('/food', require('./food'));
router.use('/service', require('./service'));

module.exports = router;