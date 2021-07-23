var express = require("express");
var router = express.Router();

const {
    open,
    close,
    isOpen,
    StartAutoOpener,
    StartAutoCloser,
    StopAutoOpener,
    StopAutoCloser,
} = require("../utils/changeHours");

// Manually opens/closes website

router.get("/open/:password", async (req, res) => {
    if (req.params.password == process.env.ADMIN_PASSWORD) {
        await open();
        res.json({ status: 200 });
    } else {
        res.json({ status: 400 });
    }
});

router.get("/close/:password", async (req, res) => {
    if (req.params.password == process.env.ADMIN_PASSWORD) {
        await close();
        res.json({ status: 200 });
    } else {
        res.json({ status: 400 });
    }
});

router.get("/enableAOC/:password", async (req, res) => {
    if (req.params.password == process.env.ADMIN_PASSWORD) {
        await StartAutoOpener();
        await StartAutoCloser();
        res.json({ status: 200 });
    } else {
        res.json({ status: 400 });
    }
});

router.get("/disableAOC/:password", async (req, res) => {
    if (req.params.password == process.env.ADMIN_PASSWORD) {
        await StopAutoOpener();
        await StopAutoCloser();
        res.json({ status: 200 });
    } else {
        res.json({ status: 400 });
    }
});

router.get("/isOpen", async (req, res) => {
    const open = await isOpen();
    res.json({ isOpen: open });
});

module.exports = router;
