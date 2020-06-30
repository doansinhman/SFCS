var express = require('express');
var router = express.Router();
var model = require('../models/model');

/* GET users listing. */
function isScreenLoggingIn(req) {
    return req.session.type == 'screen';
}

function isMemberLoggingIn(req) {
    return req.session.type == 'member';
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
router.post('/spot-cash', async function(req, res, next) {
    if (isScreenLoggingIn) {
        console.log(req.body.cart);
        let cart = {};
        try {
            cart = JSON.parse(req.body.cart);

            let unavailable = [];
            for (key in cart) {
                let food = await model.getFoodById(key);
                if (!food.available) {
                    unavailable.push(key);
                }
            }
            if (unavailable.length) {
                res.json({ success: false, unavailable: unavailable });
                console.log('unavailable');
            } else {
                let id = await model.createOrder(cart, new Date().toISOString());
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