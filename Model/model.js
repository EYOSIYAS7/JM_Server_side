const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: "string",
    },
    description: {
      type: "string",
    },
    blog: {
      type: "string",
    },
  },
  {
    timestamps: true,
  }
);
const Blogs = mongoose.model("blogs", blogSchema);

module.exports = Blogs;
