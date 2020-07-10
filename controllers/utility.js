var model = require('../models/model');

module.exports.Food = class {
    constructor(obj) {
        this.id = obj.id;
        this.court_id = obj.court_id;
        this.name = obj.name;
        this.price = obj.price;
        this.available = obj.available;
        this.type = obj.type;
        this.description = obj.description;
    }

    /**
     * @return {Array<Food>} Return all foods of all vendors
     */
    static async getAllFoods() {
        return await model.getAllFood();
    }

    /**
     * 
     * @param {Number} id ID of vendor
     */
    static async getFoodsByCourtId(id) {
        return await model.getFoodByCourtId(id);
    }

    static async getFoodById(id) {
        return await model.getFoodById(id);
    }

    static async getFoodsByFoodName(foodName) {
        return await model.getFoodByFoodName(foodName);
    }

    static async getFoodsByCourtName(courtName) {
        return await model.getFoodByCourtName(courtName);
    }

    static async getFoodsByFoodType(foodType) {
        return await model.getFoodByFoodType(foodType);
    }

    /**
     * 
     * @param {Food} food Food object, all fields not null except id & court_id
     * @param {Number} court_id ID of its vendor
     * @return {{success: Boolean, id: Number}} success: status of creation, id: food ID if success
     */
    static async createFood(food, court_id) {
        return await model.createFood(food, court_id);
    }

    /**
     * 
     * @param {Number} food_id id of food
     * @param {Number} court_id id of its vendor
     * @return {Boolean} status of deletion
     */
    static async deleteFood(food_id, court_id) {
        return await model.deleteFood(food_id, court_id);
    }

    static async updateFood(food) {
        return await model.updateFood(food);
    }
}

module.exports.Vendor = class {
    constructor(obj) {
        this.id = obj.id;
        this.full_name = obj.full_name;
        this.court_name = obj.court_name;
        this.gender = obj.gender;
        this.birthday = obj.birthday;
        this.email = obj.email;
        this.phone_number = obj.phone_number;
        this.user_name = obj.user_name;
        this.password = obj.password;
    }

    /**
     * 
     * @param {String} user_name
     * @param {String} password 
     * @return {Vendor} Vendor object or null
     */
    static async login(user_name, password) {
        return await model.loginVendor(user_name, password);
    }
    static async getReport() {
        return await model.getReport();
    }
    static async createVendor(vendor) {
        return await model.createVendor(vendor);
    }
}

module.exports.Cook = class {
    constructor(obj) {
        this.court_id = obj.court_id;
        this.user_name = obj.court_name;
        this.password = obj.password;
    }

    /**
     * 
     * @param {String} user_name
     * @param {String} password 
     * @return {Cook} Cook object or null
     */
    static async login(user_name, password) {
        return await model.loginVendor(user_name, password);
    }
    static async createCook(cook) {
        //TODO
        return null;
    }
    static async deleteCook(cook) {
        //TODO
        return null;
    }
}

module.exports.Cashier = class {
    constructor(obj) {
        this.id = obj.id;
        this.full_name = obj.full_name;
        this.gender = obj.gender;
        this.birthday = obj.birthday;
        this.email = obj.email;
        this.phone_number = obj.phone_number;
        this.user_name = obj.user_name;
        this.password = obj.password;
    }

    /**
     * 
     * @param {String} user_name
     * @param {String} password 
     * @return {Cashier} Cashier object or null
     */
    static async login(user_name, password) {
        return await model.loginCashier(user_name, password);
    }
}

module.exports.Member = class {
    constructor(obj) {
        this.id = obj.id;
        this.full_name = obj.full_name;
        this.gender = obj.gender;
        this.birthday = obj.birthday;
        this.email = obj.email;
        this.phone_number = obj.phone_number;
        this.user_name = obj.user_name;
        this.password = obj.password;
    }
    static async login(user_name, password) {
            return await model.loginMember(user_name, password);
        }
        /**
         * 
         * @param {Member} member Member object describe member fields
         * @return {Boolean} status of creation
         */
    static async createMember(member) {
        return await model.createMember(member);
    }
}

module.exports.Order = class {
    constructor(obj) {
        this.id = obj.id;
        this.cart = (obj.cart.toString() == obj.cart) ? JSON.parse(obj.cart) : obj.cart;
        this.paid = obj.paid || false;
        this.date = obj.date || new Date().toISOString();
    }

    /**
     * 
     * @param {Number} id 
     * @return {Order} Detail order of this id
     */
    static async getOrder(id) {
        return await model.getOrderById(id);
    }

    /**
     * 
     * @param {String} cashier_user_name cashier's username who confirms this order, null if called by Manager
     * @param {Number} order_id ID of this order
     * @return {Boolean} status of confirmation
     */
    static async confirmOrder(cashier_user_name, order_id, date) {
        return await model.confirmOrder(cashier_user_name, order_id, date);
    }

    static async createOrder(cart, date) {
        return await model.createOrder(cart, date);
    }
}

module.exports.Confirmation = class {
    constructor(obj) {
        this.cashier_user_name = obj.cashier_user_name;
        this.order_id = obj.order_id;
        this.date = obj.date || new Date().toISOString();
    }
}

module.exports.Screen = class {
    constructor(obj) {
        this.user_name = obj.user_name;
        this.password = obj.password;
    }
    static async login(user_name, password) {
        return await model.loginScreen(user_name, password);
    }
}

module.exports.Manager = class {
    constructor(obj) {
        this.user_name = obj.user_name;
        this.password = obj.password;
    }
    static async login(user_name, password) {
        return await model.loginManager(user_name, password);
    }

    //TODO
    //get report methods
    static async getReport() {
        return await model.getReport();
    }
}