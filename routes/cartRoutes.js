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
const { protect } = require("../middleware/authMiddleware");
const { addToCart, removeFromCart, getCart } = require("../controllers/cartController");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:id", protect, removeFromCart);

module.exports = router;
