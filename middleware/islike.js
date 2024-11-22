const isLike = (req, res, next) => {
    try {
      const role = req.cookies.role; 
    
      if (role === "user") {
        next(); 
      } else {
        return res.status(403).send({ msg: "Access denied: users only" });
      }
    } catch (error) {
      res.status(401).send({ msg: "login first" });
      
    }
  };
  
  module.exports = isLike;
  