//add 1 line
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./models/database.db');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { Locked } = require('http-errors');
const saltRounds = 10;

module.exports.createMember = async(member) => {
    let hash = bcrypt.hashSync(member.password, saltRounds);

    let params = [member.full_name, member.gender == 'male' ? 0 : 1, member.birthday, member.email, member.phone_number,
        member.user_name, hash
    ];

    return new Promise((resolve, reject) => {
        db.run('INSERT INTO member (full_name, gender, birthday, email, phone_number, \
            user_name, password) VALUES (?, ?, ?, ?, ?, ? ,?)', params,
            function(err) {
                if (err) {
                    if (err.errno == 19) {
                        resolve(false);
                    }
                    console.log(err);
                } else
                    resolve(true);
            }
        );
    }).catch((error) => { console.log(error) });
};
module.exports.createVendor = async(vendor) => {
    let hash = bcrypt.hashSync(vendor.password, saltRounds);

    let params = [vendor.full_name, vendor.court_name, vendor.gender == 'male' ? 0 : 1, vendor.birthday, vendor.email, vendor.phone_number,
        vendor.user_name, hash
    ];
    console.log(params);
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO vendor (full_name, court_name, gender, birthday, email, phone_number, \
            user_name, password) VALUES (?, ?, ?, ?, ?, ? ,?, ?)', params,
            function(err) {
                if (err) {
                    if (err.errno == 19) {
                        resolve(false);
                    }
                    console.log(err);
                } else
                    resolve(true);
            }
        );
    }).catch((error) => { console.log(error) });
};
module.exports.createManager = async(manager) => {
    let hash = bcrypt.hashSync(manager.password, saltRounds);

    let params = [manager.user_name, hash];

    return new Promise((resolve, reject) => {
        db.run('INSERT INTO manager VALUES (?, ?)', params,
            function(err) {
                if (err) {
                    resolve(false);
                    console.log(err);
                } else
                    resolve(true);
            }
        );
    }).catch((error) => { console.log(error) });
};
module.exports.createScreen = async(screen) => {
    let hash = bcrypt.hashSync(screen.password, saltRounds);

    let params = [screen.user_name, hash];

    return new Promise((resolve, reject) => {
        db.run('INSERT INTO screen VALUES (?, ?)', params,
            function(err) {
                if (err) {
                    resolve(false);
                    console.log(err);
                } else
                    resolve(true);
            }
        );
    }).catch((error) => { console.log(error) });
};
module.exports.createCashier = async(cashier) => {
    let hash = bcrypt.hashSync(cashier.password, saltRounds);

    let params = [cashier.user_name, hash];

    return new Promise((resolve, reject) => {
        db.run('INSERT INTO cashier VALUES (?, ?)', params,
            function(err) {
                if (err) {
                    resolve(false);
                    console.log(err);
                } else
                    resolve(true);
            }
        );
    }).catch((error) => { console.log(error) });
};

module.exports.createCook = async(cook) => {
    let hash = bcrypt.hashSync(cook.password, saltRounds);

    let params = [cook.court_id, cook.user_name, hash];

    return new Promise((resolve, reject) => {
        db.run('INSERT INTO cook VALUES (?, ?, ?)', params,
            function(err) {
                if (err) {
                    resolve(false);
                    console.log(err);
                } else
                    resolve(true);
            }
        );
    }).catch((error) => { console.log(error) });
};

module.exports.loginMember = async(user_name, password) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM member WHERE user_name = "' + user_name + '"', function(err, rows) {
            if (err || !rows || !rows[0]) {
                resolve(null);
            } else if (rows && bcrypt.compareSync(password, rows[0].password))
                resolve(rows[0]);
            resolve(null);
        });
    }).catch((error) => { console.log(error) });
};
module.exports.loginVendor = async(user_name, password) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM vendor WHERE user_name = "' + user_name + '"', function(err, rows) {
            if (err || !rows || !rows[0]) {
                resolve(null);
            } else if (rows && bcrypt.compareSync(password, rows[0].password))
                resolve(rows[0]);
            resolve(null);
        });
    }).catch((error) => { console.log(error) });
};
module.exports.loginManager = async(user_name, password) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM manager WHERE user_name = "' + user_name + '"', function(err, rows) {
            if (err || !rows || !rows[0]) {
                resolve(null);
            } else if (rows && bcrypt.compareSync(password, rows[0].password))
                resolve(rows[0]);
            resolve(null);
        });
    }).catch((error) => { console.log(error) });
};
module.exports.loginScreen = async(user_name, password) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM screen WHERE user_name = "' + user_name + '"', function(err, rows) {
            if (err || !rows || !rows[0]) {
                resolve(null);
            } else if (rows && bcrypt.compareSync(password, rows[0].password))
                resolve(rows[0]);
            resolve(null);
        });
    }).catch((error) => { console.log(error) });
};
module.exports.loginCashier = async(user_name, password) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM cashier WHERE user_name = "' + user_name + '"', function(err, rows) {
            if (err || !rows || !rows[0]) {
                resolve(null);
            } else if (rows && bcrypt.compareSync(password, rows[0].password))
                resolve(rows[0]);
            resolve(null);
        });
    }).catch((error) => { console.log(error) });
};
module.exports.loginCook = async(user_name, password) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM cook WHERE user_name = "' + user_name + '"', function(err, rows) {
            if (err || !rows || !rows[0]) {
                resolve(null);
            } else if (rows && bcrypt.compareSync(password, rows[0].password))
                resolve(rows[0]);
            resolve(null);
        });
    }).catch((error) => { console.log(error) });
};

module.exports.getAllFood = async() => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM food', function(err, rows) {
            if (rows)
                resolve(rows);
            else
                resolve(null);
        });
    }).catch((error) => { console.log(error) });
};
module.exports.getFoodByCourtId = async(court_id) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM food WHERE court_id=' + court_id, function(err, rows) {
            if (rows)
                resolve(rows);
            else
                resolve(null);
        });
    }).catch((error) => { console.log(error) });
};
module.exports.getFoodById = async(id) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM food WHERE id=' + id, function(err, rows) {
            if (rows && rows[0])
                resolve(rows[0]);
            else
                resolve(null);
        });
    }).catch((error) => { console.log(error) });
};
module.exports.createFood = async(food, court_id) => {
    let params = [court_id, food.name, food.price, true, food.type, food.description];

    return new Promise((resolve, reject) => {
        db.run('INSERT INTO food (court_id, name, price, available, type, description)\
                VALUES (?, ?, ?, ?, ?, ?)', params,
            function(err) {
                if (err) {
                    console.log(err);
                    resolve(-1 /*, message: "Một nhà cung cấp không được có 2 sản phẩm cùng tên."*/ );
                } else {
                    db.all('SELECT id, court_id FROM food WHERE (name="' + food.name + '")', function(err, rows) {
                        if (err) {
                            console.log(err);
                            resolve(-2 /*, message: "Lỗi không xác định."*/ );
                        } else {
                            console.log(('get id successfully'))
                            if (rows && rows[0]) {
                                resolve( /*, message: "Tạo món thành công."*/ rows[0].id);
                            }
                        }
                    });
                }
            }
        );
    }).catch((error) => { console.log(error) });
};
module.exports.deleteFood = async(id, court_id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM food WHERE (id=' + id + ') AND (court_id=' + court_id + ')',
            function(err) {
                if (err) {
                    resolve(false);
                    console.log(err);
                } else
                    resolve(true);
            }
        );
    }).catch((error) => { console.log(error) });
}
module.exports.updateFood = async(food) => {
    //let params = [food.name, food.price, food.available, food.type, food.description];
    return new Promise((resolve, reject) => {
        db.run('UPDATE food SET name="' + food.name + '", price=' + food.price + ', available=' + food.available + ', type=\'' + food.type + '\', description="' + food.description + '"\
                WHERE (id=' + food.id + ') AND (court_id=' + food.court_id + ')',
            function(err) {
                if (err) {
                    resolve(false);
                    console.log(err);
                } else
                    resolve(true);
            }
        );
    }).catch((error) => { console.log(error) });
}
module.exports.getFoodByFoodName = async(foodName) => {
    /*
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM food WHERE name LIKE "' + foodName + '"', function(err, rows) {
            if (err) {
                console.log(err);
            } else if (rows)
                resolve(rows);
            else
                resolve(null);
        });
    }).catch((error) => { console.log(error) });
    */
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM food', function(err, rows) {
            if (err) {
                console.log(err);
            } else if (rows) {
                let upper = foodName.toUpperCase();
                resolve(rows.filter((row) => (upper.indexOf(row.name.toUpperCase()) > -1) || (row.name.toUpperCase().indexOf(upper) > -1)));
            } else
                resolve(null);
        });
    }).catch((error) => { console.log(error) });
};
module.exports.getFoodByCourtName = async(courtName) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT food.id, food.court_id, food.name, food.price, food.available, food.type, food.description \
        FROM (food INNER JOIN vendor ON food.court_id = vendor.id) WHERE vendor.court_name LIKE "' + courtName + '"',
            function(err, rows) {
                if (err) {
                    console.log(err);
                } else if (rows)
                    resolve(rows);
                else
                    resolve(null);
            });
    }).catch((error) => { console.log(error) });
};
module.exports.getFoodByFoodType = async(foodType) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM food', function(err, rows) {
            if (err) {
                console.log(err);
                resolve(null);
            } else resolve(rows.filter((value, index, array) => {
                try {
                    let typeArr = JSON.parse(value.type);
                    return typeArr.some((value, index, array) => value.toUpperCase() == foodType.toUpperCase());
                } catch (e) {
                    return false;
                }
            }));
        });
    }).catch((error) => { console.log(error) });
};
module.exports.createOrder = async(cart, date) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO "order" (list, paid, date) VALUES(\'' + JSON.stringify(cart) + '\', 0, \'' + date + '\')', function(err) {
            if (err) {
                console.log("err in insert");
                console.log(err);
            } else {
                db.all('SELECT id FROM "order" WHERE (list=\'' + JSON.stringify(cart) + '\') AND (date=\'' + date + '\')', function(err, rows) {
                    if (err) {
                        console.log(err);
                        resolve(-1);
                    } else {
                        console.log(('get id successfully'))
                        if (rows && rows[0]) {
                            resolve(rows[0].id);
                        } else {
                            resolve(-1);
                        }
                    }
                });
            }
        });
    });
};
module.exports.getOrderById = async(id) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM "order" WHERE id=' + id, async function(err, rows) {
            if (err) {
                console.log(err);
                resolve(null);
            } else if (rows && rows[0]) {
                //id name price count
                let cart = {};
                try {
                    cart = JSON.parse(rows[0].list);

                    for (key in cart) {
                        let food = await module.exports.getFoodById(key);
                        cart[key] = {
                            name: food.name,
                            price: food.price,
                            count: cart[key]
                        }
                    }
                    resolve({ cart: cart, date: rows[0].date, paid: rows[0].paid });
                } catch (e) {
                    console.log(e);
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
};
module.exports.confirmOrder = async(cashier_user_name, order_id, date) => {
    return new Promise(async(resolve, reject) => {
        let order = await module.exports.getOrderById(order_id);
        if (order && order.paid == 0) {
            let bool1 = await new Promise((resolve2, reject2) => {
                db.run('UPDATE "order" SET paid=1 WHERE paid=0 AND id=' + order_id, function(err) {
                    if (err) {
                        console.log(err);
                        resolve2(false);
                    } else resolve2(true);
                });
            });

            let bool2 = await new Promise((resolve2, reject2) => {
                db.run('INSERT INTO confirm VALUES(?, ?, ?)', [cashier_user_name, order_id, date], function(err) {
                    if (err) {
                        console.log(err);
                        resolve2(false);
                    } else resolve2(true);
                });
            });

            //create new service record
            if (bool1 && bool2) {
                let remain = await new Promise((resolve, reject) => {
                    db.all('SELECT list FROM "order" WHERE id=' + order_id, function(err, rows) {
                        if (!err && rows && rows[0]) {
                            resolve(rows[0].list);
                        } else {
                            console.log(err);
                            resolve(null);
                        }
                    });
                });
                db.run('INSERT INTO service VALUES(?, ?)', [order_id, remain], function(err) {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else resolve(true);
                });
            }
            resolve(bool1 && bool2);
        } else
            resolve(false);
    });
};
//get report from database
module.exports.getReport = async() => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM "order"', async function(err, rows) {
            if (err) {
                console.log(err);
                resolve(null);
            }
            else {
                let  report = [];
                // report contain id, name, count, date, amount.
                let count = 0;
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].paid == 1){
                        let cart = JSON.parse(rows[i].list);
                        for (const key in cart) {
                            let food = await module.exports.getFoodById(key);
                            report[count] = {
                                id : key,
                                name : food.name,
                                count : cart[key],
                                price : food.price,
                                amount : food.price * cart[key],
                                date : rows[i].date
                            }
                            count ++;
                        }
                    }
                    else {continue;}
                }
                resolve(report);
            }
        });
    });
};

module.exports.getFoodsNeedToServiceOfVendor = async(court_id) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM service WHERE remain IS NOT NULL AND remain!="{}"', async function(err, rows) {
            if (err) {
                console.log(err);
                resolve(null);
            } else {
                if (!rows) {
                    resolve(null);
                }

                let arr = {};
                let len = rows.length;
                for (let i = 0; i < len; i++) {
                    let remain = JSON.parse(rows[i].remain);
                    for (foodId in remain) {
                        let food = await module.exports.getFoodById(foodId);
                        if (food.court_id == court_id) {
                            if (arr['' + foodId]) {
                                arr['' + foodId].count += remain[foodId];
                            } else {
                                arr['' + foodId] = { name: food.name, count: remain[foodId] };
                            }
                        }
                    }
                }
                resolve(arr);
            }
        });
    });
};

module.exports.submitPreparedFood = async(foodId, count) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM service WHERE remain IS NOT NULL AND remain!="{}"', async function(err, rows) {
            if (err) {
                console.log(err);
                resolve(false);
            } else {
                if (!rows) {
                    resolve(false);
                }

                let len = rows.length;
                for (let i = 0; i < len; i++) {
                    let remain = JSON.parse(rows[i].remain);
                    if (remain['' + foodId]) {
                        if (remain['' + foodId] > count) {
                            remain['' + foodId] -= count;
                            count = 0;
                        } else if (remain['' + foodId] == count) {
                            delete remain['' + foodId];
                            count = 0;
                        } else if (remain['' + foodId] < count) {
                            count -= remain['' + foodId];
                            delete remain['' + foodId];
                        }
                        //update db
                        db.run('UPDATE service SET remain=\'' + JSON.stringify(remain) + '\' WHERE order_id=' + rows[i].order_id);

                        if (count == 0) {
                            break;
                        }
                    }
                }
                resolve(count == 0);
            }
        });
    });
};

module.exports.getOrderStatus = async() => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM service ORDER BY order_id DESC LIMIT 100', function(err, rows) {
            if (err || !rows || !rows[0]) {
                resolve(null);
            } else {
                let len = rows.length;
                for (let i = 0; i < len; i++) {
                    rows[i] = { id: rows[i].order_id, ready: rows[i].remain == '{}' }
                }
                resolve(rows);
            }
        });
    });
};
