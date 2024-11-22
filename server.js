const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookies = require("cookie-parser");
app.use(cookies());

app.use(express.static("public"));
app.use(cors());

const userRoute = require("./routes/user.route");
const blogRoute = require("./routes/blog.route");
const isAuth = require("./middleware/auth");
const isValid = require("./middleware/validation");
const isLogin = require("./middleware/login");

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", isLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "blogs.html"));
});

blogRoute.get("/create", isLogin, isAuth,  (req, res) => {
  res.sendFile(path.join(__dirname, "views", "create.html"));
});

blogRoute.get("/blogs", isLogin, isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "blogs.html"));
});

blogRoute.get("/singleBlog/:id", isLogin, isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "singleBlog.html"));
});

blogRoute.get("/update/:id", isLogin, isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "editBlog.html"));
});

userRoute.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});
userRoute.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

const PORT= process.env.PORT || 3000

app.listen(3000, () => {
  console.log("server is running on port 8090");

  connectDB();
});
