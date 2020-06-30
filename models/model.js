const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./models/database.db');
const bcrypt = require('bcrypt');
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
                    resolve({ success: false /*, message: "Một nhà cung cấp không được có 2 sản phẩm cùng tên."*/ });
                } else {
                    db.all('SELECT id, court_id FROM food WHERE (name="' + food.name + '")', function(err, rows) {
                        if (err) {
                            console.log(err);
                            resolve({ success: false /*, message: "Lỗi không xác định."*/ });
                        } else {
                            console.log(('get id successfully'))
                            if (rows && rows[0]) {
                                resolve({ success: true /*, message: "Tạo món thành công."*/ , id: rows[0].id });
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
                    resolve({ success: false });
                    console.log(err);
                } else
                    resolve({ success: true });
            }
        );
    }).catch((error) => { console.log(error) });
}
module.exports.getFoodByFoodName = async(foodName) => {
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
            let bool1 = new Promise((resolve2, reject2) => {
                db.run('UPDATE "order" SET paid=1 WHERE id=' + order_id, function(err) {
                    if (err) {
                        console.log(err);
                        resolve2(false);
                    } else resolve2(true);
                });
            });

            let bool2 = new Promise((resolve2, reject2) => {
                db.run('INSERT INTO confirm VALUES(?, ?, ?)', [cashier_user_name, order_id, date], function(err) {
                    if (err) {
                        console.log(err);
                        resolve2(false);
                    } else resolve2(true);
                });
            });
            resolve(bool1 && bool2);
        } else
            resolve(false);
    });
};