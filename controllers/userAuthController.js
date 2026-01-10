const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* ================= USER REGISTER ================= */
exports.userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password, // 🔥 hashing happens in User model (pre save)
    isAdmin: false,
  });

  res.status(201).json({
    token: generateToken(user._id),
    user,
  });
};

/* ================= USER LOGIN ================= */
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  // ❌ role removed → using isAdmin
  const user = await User.findOne({ email, isAdmin: false });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🔴 BLOCK CHECK
  if (user.isBlocked === true) {
    return res.status(403).json({
      message: "Your account is blocked. Please contact admin.",
      blocked: true,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: generateToken(user._id),
    user,
  });
};

/* ================= CHANGE PASSWORD ================= */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is wrong" });
    }

    user.password = newPassword; // 🔥 auto hashed by pre-save
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password change failed" });
  }
};
