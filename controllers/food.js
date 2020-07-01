var express = require('express');
var router = express.Router();
var model = require('../models/model');
var utility = require('./utility');

var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs');

/* GET users listing. */
function isVendorLoggingIn(req) {
    return req.session.type == 'vendor';
}
router.post('/', async function(req, res, next) {
    let data = req.body;
    switch (data.target) {
        case 'all':
            res.json(await utility.Food.getAllFoods());
            break;
        case 'court_id':
            if (isVendorLoggingIn(req)) {
                res.json(await utility.Food.getFoodsByCourtId(req.session.userId));
            } else {
                res.json(null);
            }
            break;
        case 'id':
            res.json(await utility.Food.getFoodById(data.value));
            break;
        case 'foodName':
            res.json(await utility.Food.getFoodsByFoodName(data.value));
            break;
        case 'courtName':
            res.json(await utility.Food.getFoodsByCourtName(data.value));
            break;
        case 'foodType':
            res.json(await utility.Food.getFoodsByFoodType(data.value));
            break;
        default:
            break;
    }
});

router.post('/delete', async function(req, res, next) {
    if (isVendorLoggingIn(req) && req.body.id) {
        let court_id = req.session.userId;
        let success = await utility.Food.deleteFood(req.body.id, court_id);
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
        //console.log('yes');
        var form = new formidable.IncomingForm();
        form.parse(req, async function(err, fields, files) {
            //console.log(fields);
            if (fields.name && fields.price && fields.available && fields.type && fields.description && fields.court_id == req.session.userId) {
                let ret = await utility.Food.updateFood(fields);
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