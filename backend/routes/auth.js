const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// POST /api/auth/register -> Register a new user
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, collegeName, phone } = req.body;
    if (!name || !email || !password || !collegeName || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already used" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, collegeName, phone });
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login -> Authenticate user and return JWT
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid login" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid login" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // httpOnly: JS can't read it (XSS can't steal it); secure: HTTPS only; sameSite strict: not sent on cross-site requests (CSRF)
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 1000 });
    res.json({ name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout -> Clear the token cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
  res.json({ message: "Logged out" });
});

module.exports = router;