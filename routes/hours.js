var express = require('express');
var router = express.Router();

const { open, close } = require("../utils/changeHours")

// Manually opens/closes website 

router.get("/open", async (req, res) => {
  await open()
  res.send("Website is now open")
})

router.get("/close", async (req, res) => {
  await close()
  res.send("Website is now closed")
})

module.exports = router;
