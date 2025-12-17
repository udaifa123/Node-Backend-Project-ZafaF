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
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const {
  createOrder,
  getMyOrders,
  getRevenue,
} = require("../controllers/orderController");

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/revenue", protect, adminOnly, getRevenue);

module.exports = router;

