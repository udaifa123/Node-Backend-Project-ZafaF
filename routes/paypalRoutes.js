const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const PAYPAL_API = "https://api-m.sandbox.paypal.com";
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// INR → USD (sandbox test rate)
const INR_TO_USD = 0.012;

// ================== ACCESS TOKEN ==================
const getAccessToken = async () => {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const res = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
};

// ================== CREATE ORDER ==================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // INR amount from frontend

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const usdAmount = (amount * INR_TO_USD).toFixed(2);

    const accessToken = await getAccessToken();

    const orderRes = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: usdAmount,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(orderRes.data);
  } catch (err) {
    console.error("PayPal CREATE error:", err.response?.data || err.message);
    res.status(500).json({ error: "PayPal create order failed" });
  }
});

// ================== CAPTURE ORDER ==================
router.post("/capture-order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const accessToken = await getAccessToken();

    const captureRes = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(captureRes.data);
  } catch (err) {
    console.error("PayPal CAPTURE error:", err.response?.data || err.message);
    res.status(500).json({ error: "PayPal capture failed" });
  }
});

module.exports = router;
