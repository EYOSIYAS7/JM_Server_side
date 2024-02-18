const Blogs = require("../Model/model");

const addBlog = (req, res) => {
  const blog = req.body;

  const data = new Blogs(blog);

  data
    .save()
    .then(res.json(data))
    .catch((err) => {
      console.log(err);
    });
};
const FindOne = async (req, res) => {
  const id = req.params.id;

  const result = await Blogs.findById(id);
  res.json(result);
};
const deleteBlog = async (req, res) => {};
const updateBlog = async (req, res) => {};
module.exports = {
  addBlog,
  FindOne,
  deleteBlog,
  updateBlog,
};
