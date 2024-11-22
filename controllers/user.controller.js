const User = require("../models/user.schema");
const path = require("path");

const signUpUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ msg: "User already exists" });
    }

    
    const user = await User.create({ username, email, password, role });

   
    res.cookie("role", user.role, { maxAge: 900000, httpOnly: true, secure: true });
    res.cookie("id", user._id, { maxAge: 900000, httpOnly: true, secure: true });
    res.cookie("username", user.username, { maxAge: 900000, httpOnly: true, secure: true });

 
    res.sendFile(path.join(__dirname, "..","views", "login.html"));
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Error in creating user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email });

    
    if (!user || user.password !== password) {
      return res.status(401).send({ msg: "Invalid email or password" });
    }

   
    res.cookie("role", user.role, { maxAge: 900000, httpOnly: true, secure: true });
    res.cookie("id", user._id, { maxAge: 900000, httpOnly: true, secure: true });
    res.cookie("username", user.username, { maxAge: 900000, httpOnly: true, secure: true });

    
    res.sendFile(path.join(__dirname,"..", "views", "blogs.html"));
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Error during login" });
  }
};

const deleteUser = async (req, res) => {
  try {
    
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    res.send({ msg: `User deleted: ${user.username}, ${user.email}` });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Error in deleting user" });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  deleteUser,
};
