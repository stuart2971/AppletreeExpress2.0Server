require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser")
const mongoose = require('mongoose');

const { StartAutoOpener, StartAutoCloser } = require("./utils/changeHours")

StartAutoOpener()
StartAutoCloser()

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/item", require("./routes/item"))
app.use("/payment", require("./routes/payment"))
app.use("/hours", require("./routes/hours"))

// const {addMenuItem} = require("./dev/dev")


app.listen(process.env.PORT, () => {
  console.log('Running on port 3001');
});
