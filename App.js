var bodyParser = require("body-parser");
var express = require("express");
var app = express();
const mongoose = require("mongoose");
const port = 8080;

// Keep the value to true else you wont get body field in request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

// To define the routes
require("./route")(app);

app.get("/", function (req, res) {
  res.send("App Running.. !");
});

// For database Connectivity
mongoose.connect("mongodb://localhost:27017/demoData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

db.once("open", function () {
  console.log("Connected to DB");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
