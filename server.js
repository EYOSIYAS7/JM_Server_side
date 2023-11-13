const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const gridFsStorage = require("multer-gridfs-storage");
const grid = require("gridfs-stream");

const app = express();
require("dotenv").config();
const route = require("./Route/route");

const conn = mongoose.createConnection(process.env.mongo_url);

let gfs;
conn.once("open", () => {
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection("blogs");
});

mongoose.connection.on("connected", () => {
  console.log("successfully connected to db");
});

mongoose.connection.on("err", (err) => {
  console.log(err);
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(route);

app.listen(process.env.port, (req, res) => {
  console.log("server is running on port 8080");
});
