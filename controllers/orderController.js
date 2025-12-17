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



const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  const { paymentSuccess, address } = req.body;

  // ❌ DO NOT CREATE ORDER IF PAYMENT FAILED
  if (!paymentSuccess) {
    return res.status(400).json({ message: "Payment failed. Order not created." });
  }

  const cartItems = await Cart.find({ user: req.user._id }).populate("product");
  if (!cartItems.length)
    return res.status(400).json({ message: "Cart is empty" });

  const items = cartItems.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: req.user._id,
    items,
    address,
    totalAmount,
    paymentStatus: "SUCCESS",
  });

  await Cart.deleteMany({ user: req.user._id });

  res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product");

  res.json(orders);
};

exports.getRevenue = async (req, res) => {
  const orders = await Order.find();
  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  res.json({ revenue });
};
