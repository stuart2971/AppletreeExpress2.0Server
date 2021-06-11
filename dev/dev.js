// This file is for adding in menu items

// To run app in dev mode, first run server (nodemon app)
// Then run client (npm start)
// Then run webhook simulator (stripe listen --forward-to http://localhost:3001/payment/completed)
// Use test credit card details 
// Number: 4000 0000 0000 3220
// Expiration: 08/24
// CVC: 123
// ZIP: 94107

const ItemModel = require("../models/ItemModel")

async function addMenuItem(){
    let item = {
        name: "Monster Energy Drink",
        type: "other",
        image: "asd",
        price: 3.1,
        description: "asd",
        url_path: "monster_energy_drink",
        modules: [{
            objKey: "drink",
            type: "dropdown",
            required: true,
            options: [{
                option: "Color",
                value: ""
            }, {
                option: "Green",
                value: "green monster"
            }, {
                option: "Orange",
                value: "orange monster"
            }, {
                option: "Purple",
                value: "purple monster"
            }]
        }]

    }
    let a = await new ItemModel(item)
    a.save()
}

module.exports = {
    addMenuItem
}