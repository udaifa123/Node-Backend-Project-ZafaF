// const express = require("express");
// const { createProduct, getProducts } = require("../controllers/productController");
// const { protect, admin } = require("../middleware/authMiddleware");
// const router = express.Router();

// router.route("/").get(getProducts).post(protect, admin, createProduct);



// module.exports = router;





// const express = require("express");
// const router = express.Router();
// const { protect, admin } = require("../middleware/authMiddleware");
// const { createProduct, getProducts, getProductById } = require("../controllers/productController");

// router.get("/", getProducts);
// router.get("/:id", getProductById);
// router.post("/", protect, admin, createProduct);

// module.exports = router;





// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const { createProduct, getProducts, getProductById, deleteProduct } = require("../controllers/productController");

// // GET all active products
// router.get("/", getProducts);

// // GET single product
// router.get("/:id", getProductById);

// // CREATE product with image upload
// router.post("/", upload.single("image"), createProduct);

// // SOFT DELETE product
// router.delete("/:id", deleteProduct);

// module.exports = router;




const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { productValidation } = require("../validations/productValidation");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin
router.post("/", protect, adminOnly, upload.single("image"), validate(productValidation), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), validate(productValidation), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
