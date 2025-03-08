const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY);
    req.admin = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
