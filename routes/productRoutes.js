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
const { protectAdmin, protectUser } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { productValidation } = require("../validations/productValidation");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
} = require("../controllers/productController");

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

// USER (REVIEWS)
router.post("/:id/reviews", protectUser, addReview);

// ADMIN ONLY
router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  validate(productValidation),
  createProduct
);

router.put(
  "/:id",
  protectAdmin,
  upload.single("image"),
  validate(productValidation),
  updateProduct
);

router.delete("/:id", protectAdmin, deleteProduct);

module.exports = router;
