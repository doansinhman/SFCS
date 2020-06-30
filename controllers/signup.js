var express = require('express');
var router = express.Router();
var model = require('../models/model');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('./member/signup', { title: "Đăng kí thành viên", userType: req.session.type });
});
router.post('/', async function(req, res, next) {
    console.log(req.body);
    let status = await model.createMember(req.body);
    res.json(status)
});
module.exports = router;