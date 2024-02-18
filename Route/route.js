const { Router } = require("express");
const express = require("express");

const route = express.Router();

const controller = require("../Controller/handler");

route.post("/newblog", controller.addBlog);
route.get("/see/:id", controller.FindOne);

module.exports = route;
