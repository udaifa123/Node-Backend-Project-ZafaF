// const Razorpay = require("razorpay");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// exports.createOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;
//     if (!amount) return res.status(400).json({ message: "Amount is required" });

//     const options = {
//       amount: amount * 100, // convert to paise
//       currency: "INR",
//       receipt: "receipt_" + Date.now(),
//     };

//     const order = await razorpay.orders.create(options);
//     res.status(200).json(order);
//   } catch (error) {
//     console.error("Razorpay error:", error);
//     res.status(500).json({ message: "Payment order failed" });
//   }
// };
