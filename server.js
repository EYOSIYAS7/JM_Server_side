const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const route = require("./Route/route");
mongoose.connect(process.env.mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("successfully connected to db");
});

mongoose.connection.on("err", (err) => {
  console.log(err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(route);

app.listen(process.env.port, (req, res) => {
  console.log("server is running on port 8080");
});
