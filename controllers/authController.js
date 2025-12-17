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



const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password, role: "user" });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    token: generateToken(user._id)
  });
};

exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Admin already exists" });

  const admin = await User.create({ name, email, password, role: "admin" });
  res.status(201).json({
    message: "Admin created successfully",
    admin: { _id: admin._id, name: admin.name, email: admin.email },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    token: generateToken(user._id)
  });
};
