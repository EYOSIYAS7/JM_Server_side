const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://localhost/joymakersData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("successfully connected to db");
});

mongoose.connection.on("err", (err) => {
  console.log(err);
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
