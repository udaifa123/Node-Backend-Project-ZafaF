// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");

// router.get("/", protect, getWishlist);
// router.post("/add", protect, addToWishlist);
// router.delete("/:itemId", protect, removeFromWishlist);

// module.exports = router;




const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/authMiddleware");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require("../controllers/wishlistController"); // correct path

router.post("/", protectUser, addToWishlist);
router.get("/", protectUser, getWishlist);
router.delete("/:id", protectUser, removeFromWishlist);

module.exports = router;
