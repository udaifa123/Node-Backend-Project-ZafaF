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


// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, login, registerAdmin, adminLogin } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

router.post("/register", registerUser);
router.post("/login", login);
router.post("/admin/register", protect, adminOnly, registerAdmin);
router.post("/admin/login", adminLogin); // ✅ match frontend change

module.exports = router;
