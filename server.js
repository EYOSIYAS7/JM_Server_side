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
app.post("/upload", uploadBlogs.single("file"), async (req, res) => {
  return res.json({ message: "file saved " });
});

// it needs to wait until the fetch is completed thats why im using async/await
app.get("/files", async (req, res) => {
  const files = await gfs.files.find().toArray();
  // res.redirect("/");
  return res.json(files);
});
// to get a single image file data
app.get("/file/:filename", async (req, res) => {
  const file = await gfs.files.findOne({ filename: req.params.filename });
  if (!file) {
    return res.json({ err: "File doesn't exist" });
  }
  return res.json(file);
});
// to Display the image
app.get("/image/:filename", async (req, res) => {
  const image = await gfs.files.findOne({ filename: req.params.filename });

  if (!image) {
    return res.json({ err: "File doesn't exist" });
  }
  if (image.contentType === "image/jpeg" || image.contentType === "image/png") {
    gfs.createReadStream(image.filename).pipe(res);
  } else {
    return res.json({ file: image.filename });
  }
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
