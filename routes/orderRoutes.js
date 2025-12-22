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
const { createOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/create", createOrder); // ✅ NO AUTH

module.exports = router;
