const Cart = require("../models/Cart");

// Get cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.json({ items: cart ? cart.items : [] });
};

// Add to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const index = cart.items.findIndex(i => i.product.toString() === productId);
  if (index > -1) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate("items.product");
  res.json({ items: cart.items });
};

// Update quantity
// exports.updateCartItem = async (req, res) => {
//   const { itemId } = req.params;
//   const { quantity } = req.body;

//   const cart = await Cart.findOne({ user: req.user._id });
//   if (!cart) return res.status(404).json({ message: "Cart not found" });

//   const item = cart.items.id(itemId);
//   if (!item) return res.status(404).json({ message: "Item not found" });

//   item.quantity = quantity;
//   if (item.quantity <= 0) item.remove();

//   await cart.save();
//   await cart.populate("items.product");
//   res.json({ items: cart.items });
// };





exports.updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = quantity;
  if (item.quantity <= 0) {
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );
  }

  await cart.save();
  await cart.populate("items.product");
  res.json({ items: cart.items });
};


// Remove item
// exports.removeCartItem = async (req, res) => {
//   const { itemId } = req.params;

//   const cart = await Cart.findOne({ user: req.user._id });
//   if (!cart) return res.status(404).json({ message: "Cart not found" });

//   const item = cart.items.id(itemId);
//   if (!item) return res.status(404).json({ message: "Item not found" });

//   item.remove();
//   await cart.save();
//   await cart.populate("items.product");
//   res.json({ items: cart.items });
// };




exports.removeCartItem = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  await cart.save();
  await cart.populate("items.product");
  res.json({ items: cart.items });
};
