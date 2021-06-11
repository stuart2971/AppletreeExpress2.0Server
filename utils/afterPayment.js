const {GoogleSpreadsheet} = require("google-spreadsheet")

const creds = require("../secretData/client_secret.json")

const doc = new GoogleSpreadsheet('1p792ZJXdLk6bP1JqDYQJp6VQhuJKY5IaiIZjYEGi-ug');

async function addRow(obj){
    try{
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        await sheet.addRow(obj);
    }catch(err){
        console.log("ERROR (addRow): ", err)
    }
    
}

async function addToSpreadsheet(items, customerDetails){
    // console.log(items, customerDetails)
    for(let i = 0; i < items.length; i++){
        try{
            let a = await createRow(items[i], customerDetails)
            await addRow(a)
        }catch(err){
            console.log("ERROR (addToSpreadsheet): ", err)
        }
        
    }
    
}

async function createRow(item, customerDetails){
    let row;

    if(item.type == "combo") row = createComboObject(item)
    if(item.type == "sandwich") row = createSandichObject(item)
    if(item.type == "fries") row = createFriesObject(item)
    if(item.type == "other") row = createOtherObject(item)

    row.Phone = customerDetails.phone
    if(!row.Name) row.Name = customerDetails.name
    if(customerDetails.address) row.Address = customerDetails.address    
    row.ITEM = item.itemName
    return row
}

function createComboObject(combo){
    if(combo.itemName == "Falafel Plate") return {FalafelPlate: "1"}

    let comboObj = {}
    comboObj.Name = combo.name
    if(combo.itemName === "Combo 3"){
        comboObj.Falafel = "X"
    }else{
        if(combo.sandwichType == "beef") comboObj.Burger = "X"
        if(combo.sandwichType == "chicken") comboObj.Chicken = "X"
    }
    if(!combo.lettuce) comboObj.L = "X"
    if(!combo.tomato) comboObj.T = "X"
    if(!combo.cucumber) comboObj.C = "X"
    if(!combo.onion) comboObj.O = "X"

    comboObj.Spice = combo.spice
    if(combo.cheeseType) comboObj.Cheese = combo.cheeseType

    if(combo.itemName === "Combo 1") {
        comboObj.SRolls = "3"
        comboObj.Drink = combo.drink
    }
    if(combo.itemName === "Combo 2") {
        if(combo.friesType == "regular") comboObj.Reg = "1"
        if(combo.friesType == "spicy") comboObj.Spicy = "1"
        comboObj.Drink = combo.drink
    }
    if(combo.itemName === "Combo 3") {
        if(combo.sideType === "spring rolls") comboObj.SRolls = "3"
        else comboObj.Drink = combo.sideType
    }
    
    return comboObj
}
function createSandichObject(sandwich){
    let sandwichObj = {}

    sandwichObj.Name = sandwich.name
    
    if(sandwich.itemName === "Beef Sandwich") sandwichObj.Burger = "X"
    if(sandwich.itemName === "Chicken Sandwich") sandwichObj.Chicken = "X"
    if(sandwich.itemName === "Falafel Sandwich") sandwichObj.Falafel = "X"

    if(!sandwich.lettuce) sandwichObj.L = "X"
    if(!sandwich.tomato) sandwichObj.T = "X"
    if(!sandwich.cucumber) sandwichObj.C = "X"
    if(!sandwich.onion) sandwichObj.O = "X"

    sandwichObj.Spice = sandwich.spice

    if(sandwich.cheese) sandwichObj.Cheese = sandwich.cheese

    return sandwichObj
}
function createFriesObject(fries){
    let friesObj = {}

    if(fries.itemName === "Regular Fries") friesObj.Reg = "1"
    if(fries.itemName === "Poutine") friesObj.Poutine = "1"
    if(fries.itemName === "Spicy Fries") friesObj.Spicy = "1"
    if(fries.itemName === "Belgian Fries"){
        friesObj.Bel = fries.mayoType
    }

    return friesObj

}
function createOtherObject(other){
    let otherObj = {}

    if(other.itemName === "Spring Rolls x3") otherObj.SRolls = "3"
    if(other.itemName === "Brownie") otherObj.Brownie = "1"
    if(other.itemName === "Pop" || other.itemName === "Monster Energy Drink") otherObj.Drink = other.drink
    

    return otherObj
}

module.exports = {
    addToSpreadsheet
}