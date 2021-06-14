var express = require('express');
var router = express.Router();

const { open, close, isOpen } = require("../utils/changeHours")

// Manually opens/closes website 

router.get("/open", async (req, res) => {
  await open()
  res.send("Website is now open")
})

router.get("/close", async (req, res) => {
  await close()
  res.send("Website is now closed")
})

router.get("/isOpen", async (req, res) => {
  const open = await isOpen()
  res.json({ isOpen: open })
})

module.exports = router;
