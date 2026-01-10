// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User");

// // const protect = async (req, res, next) => {
// //   let token;
// //   if (
// //     req.headers.authorization &&
// //     req.headers.authorization.startsWith("Bearer")
// //   ) {
// //     try {
// //       token = req.headers.authorization.split(" ")[1];
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       req.user = await User.findById(decoded.id).select("-password");
// //       next();
// //     } catch (error) {
// //       res.status(401).json({ message: "Not authorized, token failed" });
// //     }
// //   } else {
// //     res.status(401).json({ message: "Not authorized, no token" });
// //   }
// // };

// // const admin = (req, res, next) => {
// //   if (req.user && req.user.role === "admin") next();
// //   else res.status(403).json({ message: "Access denied, admins only" });
// // };

// // module.exports = { protect, admin };



// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User");

// // exports.protect = async (req, res, next) => {
// //   let token = req.headers.authorization?.split(" ")[1];

// //   if (!token) return res.status(401).json({ message: "No token" });

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = await User.findById(decoded.id).select("-password");
// //     next();
// //   } catch {
// //     res.status(401).json({ message: "Token invalid" });
// //   }
// // };

// // exports.adminOnly = (req, res, next) => {
// //   if (req.user.role === "admin") next();
// //   else res.status(403).json({ message: "Admin access only" });
// // };



// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const Admin = require("../models/Admin");

// // Protect user routes
// exports.protectUser = async (req, res, next) => {
//   let token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");
//     if (!req.user) throw new Error();
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid user token" });
//   }
// };

// // Protect admin routes
// exports.protectAdmin = async (req, res, next) => {
//   let token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = await Admin.findById(decoded.id).select("-password");
//     if (!req.admin) throw new Error();
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid admin token" });
//   }
// };



const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

/* ================= USER PROTECT ================= */
exports.protectUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};

/* ================= ADMIN PROTECT ================= */
exports.protectAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) return res.status(401).json({ message: "Admin not found" });

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};
