var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'SFCS',
        h1: "Smart Food Court System",
        p: "Khu ẩm thực hiện đại ở khuôn viên Đại học Bách Khoa với thực phẩm sạch, an toàn mang đến cho khách hàng sự tiện lợi.",
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

router.use('/member', require('./member'));
router.use('/cashier', require('./cashier'));
router.use('/vendor', require('./vendor'));
router.use('/manager', require('./manager'));
router.use('/cook', require('./cook'));
router.use('/signup', require('./signup'));
router.use('/screen', require('./screen'));
router.use('/order', require('./order'));

//for some POST request
router.use('/food', require('./food'));

module.exports = router;