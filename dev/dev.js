// This file is for adding in menu items

// To run app in dev mode, first run server (nodemon app)
// Then run client (npm start)
// Then run webhook simulator (stripe listen --forward-to http://localhost:3001/payment/completed)
// Use test credit card details
// Number: 4000 0000 0000 3220
// Expiration: 08/24
// CVC: 123
// ZIP: 94107

const ItemData = require("../models/ItemData");

async function addMenuItem() {
    // let item = {
    //     name: "",
    //     type: "",
    //     image: "",
    //     price: 1,
    //     description: "This item is to keep track of when the website is open/closed.  Website is open, price: 1.  Website is closed, price: 0",
    //     url_path: "",
    //     modules: []
    // }
    // let a = await new ItemData(item)
    // a.save()
}

module.exports = {
    addMenuItem,
};
