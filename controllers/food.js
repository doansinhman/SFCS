var express = require('express');
var router = express.Router();
var model = require('../models/model');

var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs');

/* GET users listing. */
function isVendorLoggingIn(req) {
    return req.session.type == 'vendor';
}
router.post('/', async function(req, res, next) {
    let data = req.body;
    //console.log(data);
    if (data.target == 'all') {
        //response all food
        res.json(await model.getAllFood());
    } else if (data.target == 'court_id') {
        //response all food of court logging
        if (isVendorLoggingIn(req)) {
            res.json(await model.getFoodByCourtId(req.session.userId));
        } else {
            res.json(null);
        }
    } else if (data.target == 'id') {
        //response food has food_id
    } else if (data.target == 'foodName') {
        res.json(await model.getFoodByFoodName(data.value));
    } else if (data.target == 'courtName') {
        res.json(await model.getFoodByCourtName(data.value));
    } else if (data.target == 'foodType') {
        res.json(await model.getFoodByFoodType(data.value));
    } else res.json(null);
});

router.post('/delete', async function(req, res, next) {
    if (isVendorLoggingIn(req) && req.body.id) {
        let court_id = req.session.userId;
        let success = await model.deleteFood(req.body.id, court_id);
        if (success) {
            //TODO: delete old image.
            fs.unlink('./public/images/food/' + req.body.id + '.jpg', (err) => {
                if (err) {
                    console.error(err)
                }
                //file removed
            })
        }
        res.json(success);
    } else {
        res.json(false);
    }
});

router.post('/update', async function(req, res, next) {
    if (isVendorLoggingIn(req)) {
        console.log('yes');
        var form = new formidable.IncomingForm();
        form.parse(req, async function(err, fields, files) {
            console.log(fields);
            if (fields.name && fields.price && fields.available && fields.type && fields.description && fields.court_id == req.session.userId) {
                let ret = await model.updateFood(fields);
                if (!ret.success) {
                    return res.redirect('/vendor/menu');
                } else {
                    if (!files.fileToUpload.size) {
                        return res.redirect('/vendor/menu');
                    } else {
                        console.log('uploading');
                        var oldpath = files.fileToUpload.path;
                        var newpath = './public/images/food/' + fields.id + '.jpg';
                        mv(oldpath, newpath, function(err) {
                            if (err) throw err;
                            return res.redirect('/vendor/menu');
                        });
                    }
                }
            } else {
                return res.redirect('/vendor/menu');
            }
        });
    } else {
        res.json(false);
    }
});


module.exports = router;