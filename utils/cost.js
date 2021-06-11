const ItemModel = require("../models/ItemModel")
const specialCosts = require("../secretData/specialCosts.json")

async function getCost(items){
    let totalPrice = 0

    for(let i = 0; i < items.length; i++){
        // Checks if there are any special items that has additional costs (cheese) 
        const itemKeys = Object.keys(items[i])
        const specialCostsKeys = Object.keys(specialCosts)
        specialCostsKeys.forEach((key) => {
            if(itemKeys.includes(key)){
                if(items[i][key] != ""){
                    totalPrice += specialCosts[key]
                }
            }
        })

        // Gets the price of item
        // I do it this way because Mongo cannot return duplicate documents.  Meaning if someone orders 2 of the same items, then the returning array will only have one item
        const item = await ItemModel.findOne({ name : items[i].itemName}, "price")
        totalPrice += item.price
    }
    
    totalPrice *= 1.13
    return Math.floor(totalPrice * 100)
}

module.exports = {
    getCost
}