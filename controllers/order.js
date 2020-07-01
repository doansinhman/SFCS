var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utility = require('./utility');

/* GET users listing. */
function isScreenLoggingIn(req) {
    return req.session.type == 'screen';
}

function isMemberLoggingIn(req) {
    return req.session.type == 'member';
}

function isCashierLoggingIn(req) {
    return req.session.type == 'cashier';
}

router.get('/', function(req, res, next) {
    if (!isMemberLoggingIn(req) && !isScreenLoggingIn(req)) {
        res.render('alert', {
            title: "Đặt món",
            message: "Hãy trở thành thành viên của SFCS để sử dụng chức năng này.",
            messageStatus: "danger",
            messageStrong: "Thất bại!"
        });
    } else if (isScreenLoggingIn(req)) {
        res.render('./order/screen', {
            title: 'Thanh toán'
        })
    }
});
router.post('/get', async function(req, res, next) {
    if (isCashierLoggingIn(req)) {
        res.json(await utility.Order.getOrder(req.body.id));
    } else {
        res.json(null);
    }
});
router.post('/confirm', async function(req, res, next) {
    //console.log(req.session.userId);
    if (isCashierLoggingIn(req)) {
        res.json(await utility.Order.confirmOrder(req.session.user_name, req.body.id, new Date().toISOString()));
    } else {
        res.json(null);
    }
});
router.post('/spot-cash', async function(req, res, next) {
    if (isScreenLoggingIn) {
        console.log(req.body.cart);
        let cart = {};
        try {
            cart = JSON.parse(req.body.cart);

            let unavailable = [];
            for (key in cart) {
                let food = await utility.Food.getFoodById(key);
                if (!food.available) {
                    unavailable.push(key);
                }
            }
            if (unavailable.length) {
                res.json({ success: false, unavailable: unavailable });
                console.log('unavailable');
            } else {
                let id = await utility.Order.createOrder(cart, new Date().toISOString());
                res.json({ success: true, id: id });
                console.log('successs');
            }
        } catch (e) {
            console.log('err');
            console.log(e);
            res.json({ success: false });
        }
    } else {
        res.end();
    }
});

module.exports = router;