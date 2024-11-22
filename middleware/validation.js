const isValid = (req, res, next) => {
  try {
    const { title, content, image, category } = req.body;
    if (title && content && image && category) {
      next();
    } else {
      res.status(400).send("All fields are required");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = isValid;
