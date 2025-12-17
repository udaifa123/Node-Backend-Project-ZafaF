const express = require("express");
const router = express.Router();
const { createRazorpayOrder } = require("../controllers/paymentController"); 


router.post("/razorpay", createRazorpayOrder);

module.exports = router;
