const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protectAdmin } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminProductController");

router.post(
  "/products",
  protectAdmin,
  upload.single("image"),
  adminController.createProduct
);

router.get("/products", protectAdmin, adminController.getProducts);

router.put(
  "/products/:id",
  protectAdmin,
  upload.single("image"),
  adminController.updateProduct
);

router.delete(
  "/products/:id",
  protectAdmin,
  adminController.deleteProduct
);

module.exports = router;
