// const express=require("express");
// const {protect,admin} = require("../middleware/authMiddleware");
// const{
//     createPayment,
//     createOrder,
//     getUserOrders,
//     getAllOrders,
// }=require("../controllers/orderController");

// const router=express.Router();

// router.post("/payment",protect,createPayment);
// router.post("/",protect,createOrder);
// router.get("/user",protect,getUserOrders);
// router.get("/admin",protect,admin,getAllOrders);

// module.exports=router;


// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");
// const Cart = require("../models/Cart");
// const protect = require("../middleware/authMiddleware");

// router.post("/", protect, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id }).populate(
//       "items.product"
//     );

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const items = cart.items.map((item) => ({
//       product: item.product._id,
//       quantity: item.quantity,
//       price: item.product.price,
//     }));

//     const total = items.reduce(
//       (sum, item) => sum + item.quantity * item.price,
//       0
//     );

//     const order = await Order.create({
//       user: req.user._id,
//       items,
//       address: req.body.address,
//       total,
//     });

//     // ✅ clear cart after order
//     cart.items = [];
//     await cart.save();

//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json({ message: "Order failed" });
//   }
// });

// router.get("/", protect, async (req, res) => {
//   const orders = await Order.find({ user: req.user._id }).populate(
//     "items.product"
//   );
//   res.json(orders);
// });



const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/authMiddleware");

const {
  createOrder,
  getUserOrders,
  cancelOrder,
  clearCanceledOrders,
  requestReturn,
  requestCancellation // make sure this is imported
} = require("../controllers/orderController");

router.post("/", protectUser, createOrder);
router.get("/", protectUser, getUserOrders);
router.put("/:id/cancel", protectUser, cancelOrder);
router.delete("/clear-canceled", protectUser, clearCanceledOrders);

// RETURN ORDER
router.post("/return", protectUser, requestReturn);

// REQUEST CANCEL
router.post("/:id/request-cancel", protectUser, requestCancellation);

module.exports = router;
