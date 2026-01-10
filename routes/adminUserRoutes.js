const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/authMiddleware");

const {
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
} = require("../controllers/adminUserController");

router.get("/users", protectAdmin, getUsers);
router.put("/users/:id/block", protectAdmin, blockUser);
router.put("/users/:id/unblock", protectAdmin, unblockUser);
router.delete("/users/:id", protectAdmin, deleteUser);

module.exports = router;
