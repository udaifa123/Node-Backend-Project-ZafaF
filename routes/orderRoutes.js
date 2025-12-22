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





const express = require("express");
const {
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);
router.get("/my", protect, getMyOrders);

module.exports = router;
