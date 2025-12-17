const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// USER REGISTER
exports.userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "User already exists" });

  const user = await User.create({
    name,
    email,
    password,
    role: "user",
  });

  res.status(201).json({
    token: generateToken(user._id),
    user,
  });
};

// USER LOGIN
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, role: "user" });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id),
    user,
  });
};
