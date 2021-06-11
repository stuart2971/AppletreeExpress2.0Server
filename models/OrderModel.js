var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const OrderModel = new Schema({
    items: [Object],
    customerDetails: Object
})

module.exports = mongoose.model('OrderModel', OrderModel); 