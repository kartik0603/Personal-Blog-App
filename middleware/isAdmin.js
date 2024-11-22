const isAdmin = (req, res, next) => {
    try {
      const role = req.cookies.role; 
    
      if (role === "admin") {
        next(); 
      } else {
        return res.status(403).send({ msg: "Access denied: Admins only" });
      }
    } catch (error) {
      res.status(401).send({ msg: "login first" });
      
    }
  };
  
  module.exports = isAdmin;
  