const express = require("express");
const router = express.Router();

// Import exactly what you exported
const { registerAdmin, loginAdmin } = require("../controllers/authController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

module.exports = router;
