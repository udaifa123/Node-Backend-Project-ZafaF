// const paypal = require("@paypal/checkout-server-sdk");
// const Order = require("../models/Order");

// // PayPal environment
// const clientId = process.env.PAYPAL_CLIENT_ID;
// const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// const paypalClient = new paypal.core.PayPalHttpClient(environment);

// // Create PayPal Order
// exports.createPaypalOrder = async (req, res) => {
//   try {
//     const { total } = req.body;

//     const request = new paypal.orders.OrdersCreateRequest();
//     request.prefer("return=representation");
//     request.requestBody({
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           amount: {
//             currency_code: "INR",
//             value: total.toFixed(2),
//           },
//         },
//       ],
//     });

//     const order = await paypalClient.execute(request);
//     res.json({ id: order.result.id });
//   } catch (err) {
//     console.error("PAYPAL CREATE ERROR:", err);
//     res.status(500).json({ message: "Failed to create PayPal order" });
//   }
// };

// // Capture PayPal Order
// exports.capturePaypalOrder = async (req, res) => {
//   try {
//     const { orderID, address, items, total } = req.body;

//     const request = new paypal.orders.OrdersCaptureRequest(orderID);
//     request.requestBody({});

//     const capture = await paypalClient.execute(request);

//     if (capture.result.status !== "COMPLETED") {
//       return res.status(400).json({ message: "Payment not completed" });
//     }

//     // Save Order in DB
//     const order = await Order.create({
//       user: req.user._id,
//       items: items.map(i => ({
//         product: i.productId,
//         quantity: i.quantity,
//       })),
//       total,
//       address,
//       status: "Paid",
//       statusHistory: [{ status: "Paid" }],
//     });

//     res.json({ message: "Payment successful", order });
//   } catch (err) {
//     console.error("PAYPAL CAPTURE ERROR:", err);
//     res.status(500).json({ message: "Failed to capture PayPal order" });
//   }
// };
