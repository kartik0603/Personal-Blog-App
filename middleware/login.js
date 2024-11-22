const path = require("path");

const isLogin = (req, res, next) => {
  try {
    const { id } = req.cookies;
    if (id) {
      next(); 
    } else {
      
      res.sendFile(path.join(__dirname, "..", "views", "login.html")); 
    }
  } catch (error) {
    res.status(401).send({ msg: "login first" });
    
  }
};

module.exports = isLogin;
