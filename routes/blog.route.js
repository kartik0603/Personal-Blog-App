const express = require("express");
const blogRouter = express.Router();
const {
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
} = require("../controllers/blog.controller");

const isAuth = require("../middleware/auth");
const isValid = require("../middleware/validation");
const isLogin = require("../middleware/login");
const isAdmin = require("../middleware/isAdmin");

const isLike = require("../middleware/islike");


blogRouter.post("/create", isAuth, isAdmin, isValid, createBlog);
blogRouter.get("/blogs", getBlogs);
blogRouter.get("/blogfetching", getBlogsfetching);
blogRouter.delete("/delete/:id", isAdmin, isAuth, deleteBlog);
blogRouter.patch("/update/:id", isAdmin, isAuth, updateBlog);
blogRouter.get("/singleBlog/:id", singleBlogGeting);
blogRouter.get("/singleBlog/data/:id", fetchSingleBlogData);

blogRouter.get("/logout", loggOut);
blogRouter.delete("/deleteAll", isAdmin, isAuth, deleteAllBlogs);

blogRouter.patch("/like/:id", isAuth, isLike, likeBlog);
blogRouter.patch("/comment/:id", isAuth, isLike, isLogin, commentsOnBlog);

blogRouter.get("search", searchBlog);

module.exports = blogRouter;
