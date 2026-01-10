const { client } = require('../config/paypal');
const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/Order');

/* ================= CREATE PAYPAL ORDER ================= */
exports.createPayPalOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount, shippingAddress, orderData } = req.body;
    const userId = req.user?._id;

    console.log("Creating PayPal order for user:", userId);
    console.log("Total amount:", totalAmount);

    // Convert INR to USD (approximate)
    const amountInUSD = (totalAmount / 83).toFixed(2);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "USD",
          value: amountInUSD,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: amountInUSD
            }
          }
        },
        description: "ZafaF Perfumes Order"
      }],
      application_context: {
        brand_name: "ZafaF Perfumes",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.FRONTEND_URL}/order-success`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`
      }
    });

    console.log("Sending request to PayPal...");
    const order = await client().execute(request);
    console.log("PayPal order created:", order.result.id);

    // Create order in database
    const newOrder = new Order({
      user: userId,
      orderItems: cartItems || [],
      shippingAddress: shippingAddress || {},
      paymentMethod: "paypal",
      paymentResult: {
        paypalOrderId: order.result.id,
        status: "pending"
      },
      itemsPrice: orderData?.itemsPrice || 0,
      taxPrice: orderData?.taxPrice || 0,
      shippingPrice: orderData?.shippingPrice || 0,
      totalPrice: totalAmount,
      isPaid: false,
      status: "Pending Payment"
    });

    await newOrder.save();
    console.log("Order saved to DB:", newOrder._id);

    res.json({
      success: true,
      orderID: order.result.id,
      paypalOrder: order.result,
      dbOrderId: newOrder._id,
      approvalUrl: order.result.links.find(link => link.rel === 'approve').href
    });

  } catch (error) {
    console.error("PayPal Order Error Details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to create PayPal order",
      error: error.message,
      details: "Check server logs for more info"
    });
  }
};

/* ================= CAPTURE PAYPAL PAYMENT ================= */
exports.capturePayPalPayment = async (req, res) => {
  try {
    const { orderID, dbOrderId } = req.body;
    console.log("Capturing PayPal payment for order:", orderID);

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client().execute(request);
    console.log("Capture result status:", capture.result.status);

    if (capture.result.status === "COMPLETED") {
      // Update order in database
      const order = await Order.findById(dbOrderId);
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: "Order not found in database" 
        });
      }

      const payer = capture.result.payer;
      const purchaseUnit = capture.result.purchase_units[0];
      const captureId = purchaseUnit.payments.captures[0].id;

      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "Processing";
      order.paymentResult = {
        id: captureId,
        status: capture.result.status,
        email_address: payer.email_address,
        payer_id: payer.payer_id,
        update_time: capture.result.update_time,
        paypalOrderId: orderID
      };

      await order.save();
      console.log("Order updated as paid:", order._id);

      res.json({
        success: true,
        message: "Payment captured successfully",
        order: {
          _id: order._id,
          totalPrice: order.totalPrice,
          status: order.status,
          paidAt: order.paidAt
        },
        captureDetails: {
          status: capture.result.status,
          captureId: captureId,
          amount: purchaseUnit.amount.value,
          payerEmail: payer.email_address
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
        status: capture.result.status
      });
    }

  } catch (error) {
    console.error("PayPal Capture Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment capture failed",
      error: error.message 
    });
  }
};

/* ================= GET PAYPAL CLIENT ID ================= */
exports.getPayPalClientId = async (req, res) => {
  try {
    console.log("Sending PayPal client ID:", process.env.PAYPAL_CLIENT_ID);
    
    res.json({
      success: true,
      clientId: process.env.PAYPAL_CLIENT_ID,
      environment: "sandbox",
      currency: "USD"
    });
  } catch (error) {
    console.error("Error getting PayPal client ID:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to get PayPal configuration" 
    });
  }
};

/* ================= VERIFY PAYPAL PAYMENT ================= */
exports.verifyPayPalPayment = async (req, res) => {
  try {
    const { orderID } = req.body;
    console.log("Verifying PayPal order:", orderID);

    const request = new paypal.orders.OrdersGetRequest(orderID);
    const order = await client().execute(request);

    res.json({
      success: true,
      order: order.result
    });
  } catch (error) {
    console.error("PayPal Verify Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to verify payment",
      error: error.message 
    });
  }
};

/* ================= TEST PAYPAL CONNECTION ================= */
exports.testPayPalConnection = async (req, res) => {
  try {
    // Simple test to check PayPal connection
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    
    console.log("Testing PayPal connection...");
    console.log("Client ID exists:", !!clientId);
    console.log("Mode:", mode);
    
    res.json({
      success: true,
      connected: true,
      clientIdExists: !!clientId,
      mode: mode,
      message: "PayPal configuration is loaded successfully"
    });
  } catch (error) {
    console.error("PayPal connection test error:", error);
    res.status(500).json({
      success: false,
      connected: false,
      error: error.message
    });
  }
};