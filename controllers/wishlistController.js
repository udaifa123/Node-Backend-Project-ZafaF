const Wishlist = require("../models/Wishlist");

exports.addToWishlist = async (req, res) => {
  const exists = await Wishlist.findOne({
    user: req.user._id,
    product: req.body.productId,
  });

  if (exists) return res.status(400).json({ message: "Already in wishlist" });

  const wishlist = await Wishlist.create({
    user: req.user._id,
    product: req.body.productId,
  });

  res.status(201).json(wishlist);
};

exports.removeFromWishlist = async (req, res) => {
  await Wishlist.findOneAndDelete({
    user: req.user._id,
    product: req.params.id,
  });

  res.json({ message: "Removed from wishlist" });
};

exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user._id }).populate("product");
  res.json(wishlist);
};
