// const Order=require("..models/Order");
// const Razorpay=require("razorpay");

// const instance=new Razorpay({
//     key_id:process.env.RAZORPAY_KEY_ID,
//     key_secret:process.env.RAZORPAY_KEY_SECRET,
// });

// exports.createPayment=async(req,res)=>{
//     const{amount}=req.body;
//     try{
//         const order=await instance.orders.create({
//             amount:amount*100,
//             currency:"INR",
//             receipt:`receipt_${Date.now()}`,
//         });
//         res.json(order);
//     }catch(error){
//         res.status(500).json({message:"Payment creation failed"});
//     }
// };

// exports.createOrder=async(req,res)=>{
//     try{
//         const newOrder=await Order.create({
//             user:req.user._id,
//             products:req.body.products,
//             amount:req.body.amount  ,
//             paymentId:req.body.paymentId,
//             status:"Paid",
//         });
//         res.status(201).json(newOrder);
//     }catch(error){
//         res.status(500).json({message:"Order creation failed"});
//     }
// };

// exports.getUserOrders=async (req,res)=>{
//     const orders=await Order.find({user:req.user._id}).populate("products.product");
//     res.json(orders);
// };

// exports.getAllOrders=async (req,res)=>{
//       const orders=await Order.find({user:req.user._id}).populate("products.product");
//       res.json(orders);
// };

// exports.getAllOrders=async(req,res)=>{
//     const orders=await Order.find().populate("products.product");
//     const totalRevenue=orders.reduce((acc,order)=>acc+order.amount,0);
//     res.json({orders,totalRevenue});
// };


const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================
   1️⃣ CREATE RAZORPAY ORDER
========================= */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await Cart.find({ user: userId }).populate("product");
    if (!cartItems.length)
      return res.status(400).json({ message: "Cart is empty" });

    const totalAmount = cartItems.reduce(
      (sum, i) => sum + i.quantity * i.product.price,
      0
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({
      order: razorpayOrder,
      amount: totalAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Razorpay order failed" });
  }
};

/* =========================
   2️⃣ VERIFY PAYMENT + SAVE ORDER
========================= */
exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      address,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: "Invalid signature" });

    const cartItems = await Cart.find({ user: userId }).populate("product");

    const totalAmount = cartItems.reduce(
      (sum, i) => sum + i.quantity * i.product.price,
      0
    );

    const order = await Order.create({
      user: userId,
      items: cartItems.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price,
      })),
      address,
      totalAmount,
      paymentStatus: "SUCCESS",
    });

    await Cart.deleteMany({ user: userId });

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

/* =========================
   3️⃣ ORDER HISTORY
========================= */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Orders fetch failed" });
  }
};
