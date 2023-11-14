const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const grid = require("gridfs-stream");
const crypto = require("crypto");
const path = require("path");
const app = express();
require("dotenv").config();
const route = require("./Route/route");

const conn = mongoose.createConnection(process.env.mongo_url);

let gfs;
conn.once("open", () => {
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection("upload");
});

// create a storage engine

const storage = new GridFsStorage({
  url: process.env.mongo_url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const fileName = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: fileName,
          bucketName: "upload",
        };
        resolve(fileInfo);
      });
    });
  },
});

mongoose.connection.on("connected", () => {
  console.log("successfully connected to db");
});
const uploadBlogs = multer({ storage });
app.post("/upload", uploadBlogs.single("file"), (req, res) => {
  res.json({ file: req.body });
});

mongoose.connection.on("err", (err) => {
  console.log(err);
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(route);

app.listen(process.env.port, (req, res) => {
  console.log("server is running on port 8080");
});
