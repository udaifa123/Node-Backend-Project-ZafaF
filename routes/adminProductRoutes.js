const express = require("express");
const upload = require("../middleware/upload");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminProductController");

const router = express.Router();

router.post("/products", protect, admin, upload.single("image"), createProduct);
router.get("/products", protect, admin, getProducts);
router.put("/products/:id", protect, admin, upload.single("image"), updateProduct);
router.delete("/products/:id", protect, admin, deleteProduct);

module.exports = router;
