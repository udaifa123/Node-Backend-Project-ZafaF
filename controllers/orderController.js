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




// const razorpay = require("../config/razorpay");

// exports.createOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).json({ message: "Amount required" });
//     }

//     const options = {
//       amount: amount * 100, // rupees → paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order
//     });

//   } catch (error) {
//     console.error("Order create error:", error);
//     res.status(500).json({ message: "Order creation failed" });
//   }
// };


const Order = require("../models/Order");
const Cart = require("../models/Cart");


// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    // 1️⃣ Find cart & populate product
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ Build order items
    const orderItems = cart.items.map((item) => {
      if (!item.product) {
        throw new Error("Product not found in cart");
      }

      return {
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    // 3️⃣ Calculate total
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 4️⃣ Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress: req.body.address,
      totalAmount,
      isPaid: false,
    });

    // 5️⃣ Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({
      message: error.message || "Order failed",
    });
  }
};


// ================= GET MY ORDERS =================
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(orders);
};
