const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ error: "Access denied. Token not provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Access token has expired." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
};
module.exports = verifyToken;
