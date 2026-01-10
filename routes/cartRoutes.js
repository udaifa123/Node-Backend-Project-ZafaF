// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const { getCart, addToCart, removeFromCart } = require("../controllers/cartController");

// router.get("/", protect, getCart);
// router.post("/add", protect, addToCart);
// router.delete("/:itemId", protect, removeFromCart);

// module.exports = router;



// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");
// const { getCart, addToCart, removeFromCart } = require("../controllers/cartController");

// const router = express.Router();

// router.get("/", protect, getCart);
// router.post("/add", protect, addToCart);
// router.delete("/:itemId", protect, removeFromCart);

// module.exports = router;





const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

router.get("/", protectUser, getCart);
router.post("/", protectUser, addToCart);
// router.put("/:itemId", protectUser, updateCartItem);
// router.delete("/:itemId", protectUser, removeCartItem);
router.put("/:productId", protectUser, updateCartItem);
router.delete("/:productId", protectUser, removeCartItem);

module.exports = router;
