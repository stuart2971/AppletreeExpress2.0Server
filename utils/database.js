const ItemData = require("../models/ItemData");
const OrderModel = require("../models/OrderModel");

async function addToDatabase(items, customerDetails) {
    let order = new OrderModel({ items, customerDetails });
    let id = (await order.save())._id;
    return id.toString();
}

async function getOrderFromDatabase(id) {
    let order = await OrderModel.findOne({ _id: id });
    return order;
}

// async function addItemToMenu(){

// }
module.exports = {
    addToDatabase,
    getOrderFromDatabase,
};
