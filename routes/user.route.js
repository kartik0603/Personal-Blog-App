const express = require("express");
const userRouter = express.Router();

const {
  signUpUser,
  loginUser,
  deleteUser,
} = require("../controllers/user.controller");

userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);



userRouter.delete("/delete/:id", deleteUser);

module.exports = userRouter;
