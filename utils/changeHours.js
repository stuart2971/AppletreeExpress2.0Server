var CronJob = require('cron').CronJob;

const ItemModel = require("../models/ItemModel")

const opener = new CronJob('0 0 11 * * 1-5', function() {
    open()
}, null, true, 'America/Thunder_Bay');

const closer = new CronJob('0 0 18 * * 1-5', function() {
    close()
}, null, true, 'America/Thunder_Bay');

async function open(){
    const item = await ItemModel.updateOne(
        { _id: "60c6a2b48200931fb4b7c67e" }, 
        {price: 1})
}

async function close(){
    const item = await ItemModel.updateOne(
        { _id: "60c6a2b48200931fb4b7c67e" }, 
        {price: 0})
}

async function StartAutoOpener(){
    opener.start();
}
async function StartAutoCloser(){
    closer.start();
}
async function StopAutoOpener(){
    opener.stop();
}
async function StopAutoCloser(){
    closer.stop();
}

async function isOpen(){
    const item = await ItemModel.findOne(
        { _id: "60c6a2b48200931fb4b7c67e" }, 
        "price")

    
    return item.price == 1 ? true : false
}

module.exports = {
    open, 
    close,
    StartAutoOpener,
    StartAutoCloser,
    StopAutoOpener,
    StopAutoCloser,
    isOpen
}