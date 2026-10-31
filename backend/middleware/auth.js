const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.cookie?.match(/(?:^|;\s*)token=([^;]+)/)?.[1];
  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

module.exports = { auth, adminOnly };