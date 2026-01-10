// const express = require("express");
// const router = express.Router();
// const { register, login } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);

// module.exports = router;




// const express = require("express");
// const router = express.Router();
// const {
//   registerUser,
//   login,
//   registerAdmin,
// } = require("../controllers/authController");

// const { protect, adminOnly } = require("../middleware/authMiddleware");

// // USER
// router.post("/register", registerUser);
// router.post("/login", login);

// // ADMIN (protected)
// router.post("/admin/register", protect, adminOnly, registerAdmin);

// module.exports = router;





const express = require("express");
const router = express.Router();

// Controllers
const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

// Middleware
const { protectUser } = require("../middleware/authMiddleware");

// ================= USER ROUTES =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// Logged-in user routes
router.get("/me", protectUser, getMe);
router.put("/update-profile", protectUser, updateProfile);
router.put("/change-password", protectUser, changePassword);
router.delete("/delete-account", protectUser, deleteAccount);

// ================= ADMIN ROUTES =================
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

module.exports = router;
