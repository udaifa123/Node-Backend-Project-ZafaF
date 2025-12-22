const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  const { productId } = req.body;

  const existing = await Cart.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existing) {
    existing.quantity += 1;
    await existing.save();
    return res.json(existing);
  }

  const cart = await Cart.create({
    user: req.user._id,
    product: productId,
  });

  res.status(201).json(cart);
};

exports.removeFromCart = async (req, res) => {
  await Cart.findOneAndDelete({
    user: req.user._id,
    product: req.params.id,
  });

  res.json({ message: "Removed from cart" });
};

exports.getCart = async (req, res) => {
  const cart = await Cart.find({ user: req.user._id }).populate("product");
  res.json(cart); // 🔥 ARRAY
};
