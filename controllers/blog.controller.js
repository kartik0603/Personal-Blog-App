const Blog = require("../models/blog.schema");
const User = require("../models/user.schema");
const Fuse = require("fuse.js");
const path = require("path");

const createBlog = async (req, res) => {
  const { title, content, image, category } = req.body;
  const author = req.cookies.username;

  if (!title || !content || !category) {
    return res.status(400).send("All fields are required");
  }

  try {
    const blog = await Blog.create({
      title,
      content,
      image,
      category,
      author,
    });

    res.cookie("blogId", blog.id).send(`Blog created by ${author}`);
    // res.sendFile(path.join(__dirname,"..", "views", "blogs.html"));
  } catch (err) {
    res.status(500).send({ msg: "Error creating blog", error: err.message });
  }
};

const getBlogs = async (req, res) => {
  const { category } = req.query;

  try {
    const blogs = category ? await Blog.find({ category }) : await Blog.find();
    // res.send(blogs);
    res.sendFile(path.join(__dirname, "..", "views", "blogs.html"));
  } catch (error) {
    res.status(500).send({ msg: "Error fetching blogs", error: error.message });
  }
};

const getBlogsfetching = async (req, res) => {
  const { category } = req.query;

  try {
    const blogs = category ? await Blog.find({ category }) : await Blog.find();
    res.send(blogs);
    // res.sendFile(path.join(__dirname, "..", "views", "blogs.html"));
  } catch (error) {
    res.status(500).send({ msg: "Error fetching blogs", error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (blog) {
      res.send({ msg: `Blog deleted: ${blog.title}` });
    } else {
      res.status(404).send({ msg: "Blog not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        msg: "Error deleting blog May Be you are not admin",
        error: error.message,
      });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (blog) {
      res.send({ msg: `Blog updated: ${blog.title}` });
    } else {
      res.status(404).send({ msg: "Blog not found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error updating blog", error: error.message });
  }
};

const singleBlogGeting = async (req, res) => {
  const { id } = req.params;

  try {
    const singleBlog = await Blog.findById(id);
    if (singleBlog) {
      res.sendFile(path.join(__dirname, "..", "views", "singleBlog.html"));
    } else {
      res.status(404).send({ msg: "Blog not found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error fetching blog", error: error.message });
  }
};

const fetchSingleBlogData = async (req, res) => {
  const { id } = req.params;

  try {
    const singleBlog = await Blog.findById(id);
    if (singleBlog) {
      res.json(singleBlog);
    } else {
      res.status(404).json({ msg: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error fetching blog", error: error.message });
  }
};

const likeBlog = async (req, res) => {
  const userId = req.cookies.id;
  const blogId = req.params.id;

  try {
    const post = await Blog.findById(blogId).populate("likedBy");

    if (!post) {
      return res.status(404).send({ msg: "Blog not found" });
    }

    const isAlreadyLiked = post.likedBy.some(
      (user) => user._id.toString() === userId
    );

    if (isAlreadyLiked) {
      post.likedBy.pull(userId);
    } else {
      post.likedBy.push(userId);
    }

    await post.save();
    const updatedPost = await Blog.findById(blogId).populate("likedBy");
    res.send(updatedPost);
  } catch (error) {
    res.status(500).send({ msg: "Error liking blog", error: error.message });
  }
};

const commentsOnBlog = async (req, res) => {
  const userId = req.cookies.id;
  const blogId = req.params.id;

  try {
    const user = await User.findById(userId);
    const post = await Blog.findById(blogId);

    if (!post) {
      return res.status(404).send({ msg: "Blog not found" });
    }

    const newComment = {
      username: user.username,
      text: req.body.text,
    };

    post.comments.push(newComment);
    await post.save();

    res.send({ username: user.username, text: req.body.text });
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Error commenting on blog", error: error.message });
  }
};

const searchBlog = async (req, res) => {
  const query = req.query.blogs;

  try {
    const blogs = await Blog.find();
    const options = {
      keys: ["author", "category", "title"],
      includeScore: true,
    };

    const fuse = new Fuse(blogs, options);
    const result = fuse.search(query);

    const matchedBlogs = result.map((result) => result.item);

    res.send(matchedBlogs);
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Error searching blogs", error: error.message });
  }
};

const loggOut = (req, res) => {
  res.clearCookie("id");
  res.clearCookie("role");
  res.sendFile(path.join(__dirname, "..","views", "login.html"));

};

 const deleteAllBlogs = async(req, res) => {
   try{
    const blogs = await Blog.deleteMany();
    if(blogs.deletedCount ===0){
      return res.status(404).send({msg:"No blogs Deleted"})
    }
    return res.status(200).json({ message: 'All blogs deleted successfully!' });
   }catch(error){
    return res.status(500).json({ message: 'Error deleting blogs' });
   }
 }
 
module.exports = {
  createBlog,
  getBlogs,
  getBlogsfetching,
  deleteBlog,
  updateBlog,
  singleBlogGeting,
  fetchSingleBlogData,
  likeBlog,
  commentsOnBlog,
  searchBlog,
  loggOut,
  deleteAllBlogs
};
