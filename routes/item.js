var express = require("express");
var router = express.Router();

const ItemData = require("../models/ItemData");
const specialCosts = require("../secretData/specialCosts.json");

// Gets an item given a url_path
router.get("/url/:item_url", async (req, res) => {
    const item = await ItemData.findOne({ url_path: req.params.item_url });
    res.json(item);
});

// Gets the special pricing
router.get("/specialCosts", async (req, res) => {
    res.json(specialCosts);
});

// Gets all the elements of an item type (e.g. sandwich, combo, fries, other)
router.get("/type/:type", async (req, res) => {
    const type = await ItemData.find(
        { type: req.params.type },
        "name image price description url_path"
    );
    res.json(type);
});

module.exports = router;
