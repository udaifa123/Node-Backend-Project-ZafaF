const express = require("express");
const router = express.Router();

const {
  userRegister,
  userLogin,
  changePassword,
} = require("../controllers/userAuthController");

const { protectUser } = require("../middleware/authMiddleware");

router.post("/register", userRegister);
router.post("/login", userLogin);

// ✅ FIXED LINE
router.put("/change-password", protectUser, changePassword);

module.exports = router;
