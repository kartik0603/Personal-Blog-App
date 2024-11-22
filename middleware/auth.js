const isAuth = (req, res, next) => {
  try {
    const userId = req.cookies.id; 
  
  
    if (userId) {
        
        next();
    } else {
        res.status(401).send({ msg: "login first" }); 
    }
  } catch (error) {
    res.status(401).send({ msg: "login first" });
    
  }
};




module.exports = isAuth;
