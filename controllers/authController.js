// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const Joi = require("joi");

// // Generate JWT token
// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// // Register controller
// const register = async (req, res) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//   });

//   const { error } = schema.validate(req.body);
//   if (error) {
//     res.status(400);
//     throw new Error(error.details[0].message);
//   }

//   const { name, email, password } = req.body;
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   const user = await User.create({ name, email, password });
//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     //  token: generateToken(user._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// };

// // Login controller
// const login = async (req, res) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   });

//   const { error } = schema.validate(req.body);
//   if (error) {
//     res.status(400);
//     throw new Error(error.details[0].message);
//   }

//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   // Call matchPassword method from schema
//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }
// };

// module.exports = { register, login };










// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // ✅ USER REGISTER (only user)
// exports.registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: "User already exists" });

//   const user = await User.create({
//     name,
//     email,
//     password, // ❗ hash auto by schema
//     role: "user",
//   });

//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     token: generateToken(user._id),
//   });
// };

// // ✅ LOGIN (user & admin)
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user || !(await user.matchPassword(password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     token: generateToken(user._id),
//   });
// };

// // ✅ ADMIN REGISTER (protected)
// exports.registerAdmin = async (req, res) => {
//   const { name, email, password } = req.body;

//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: "Admin already exists" });

//   const admin = await User.create({
//     name,
//     email,
//     password,
//     role: "admin",
//   });

//   res.status(201).json({
//     message: "Admin created successfully",
//     admin: {
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//     },
//   });
// };





const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// --- User ---
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password });
  res.status(201).json({ token: generateToken(user._id), user });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ BLOCK CHECK (IMPORTANT)
  if (user.isBlocked === true) {
    return res.status(403).json({
      message: "Your account is blocked. Please contact admin.",
      blocked: true,
    });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: generateToken(user._id),
    user,
  });
};


// --- Admin ---
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: "Admin already exists" });

  const admin = await Admin.create({ name, email, password });
  res.status(201).json({ token: generateToken(admin._id), admin });
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
  res.json({ token: generateToken(admin._id), admin });
};


exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  const user = req.user;

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;
  user.preferences = req.body.preferences || user.preferences;

  const updatedUser = await user.save();
  res.json(updatedUser);
};

exports.changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(400).json({ message: "Current password incorrect" });
  }

  user.password = req.body.newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
};

exports.deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: "Account deleted successfully" });
};
