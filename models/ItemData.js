var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ItemData = new Schema({
    name: String,
    type: String,
    image: String,
    price: Number,
    description: String,
    url_path: String,
    note: String,
    modules: [Object],
});

module.exports = mongoose.model("ItemData", ItemData);
