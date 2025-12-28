const Wishlist = require("../models/Wishlist");


exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const exists = await Wishlist.findOne({
    user: req.user._id,
    product: productId,
  });

  if (exists) {
    return res.status(400).json({ message: "Already in wishlist" });
  }

  const wishlist = await Wishlist.create({
    user: req.user._id,
    product: productId,
  });

  res.status(201).json(wishlist);
};


exports.removeFromWishlist = async (req, res) => {
  const deleted = await Wishlist.findOneAndDelete({
    _id: req.params.id,   
    user: req.user._id,
  });

  if (!deleted) {
    return res.status(404).json({ message: "Wishlist item not found" });
  }

  res.json({ message: "Removed from wishlist" });
};


exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.find({
    user: req.user._id,
  }).populate("product");

  res.json(wishlist);
};
