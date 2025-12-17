const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ADMIN REGISTER
exports.adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "Admin already exists" });

  const admin = await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  res.status(201).json({
    token: generateToken(admin._id),
    admin,
  });
};

// ADMIN LOGIN
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email, role: "admin" });
  if (!admin || !(await admin.matchPassword(password)))
    return res.status(401).json({ message: "Invalid admin credentials" });

  res.json({
    token: generateToken(admin._id),
    admin,
  });
};
