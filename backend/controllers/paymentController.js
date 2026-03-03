const stripe = require("../utils/stripe");
const Order = require("../models/Order");

const createPaymentIntent = async (req, res) => {
  try {

    const { orderIds } = req.body;

    if (!orderIds || !orderIds.length) {
      return res.status(400).json({
        error: "Order IDs required"
      });
    }

    // Get orders from database (MOST IMPORTANT)
    const orders = await Order.find({
      _id: { $in: orderIds }
    });

    if (!orders.length) {
      return res.status(404).json({
        error: "Orders not found"
      });
    }

    // Calculate amount securely from DB
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    console.log("Payment amount:", totalAmount);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe uses cents
      currency: "usd",
      metadata: {
        orderIds: JSON.stringify(orderIds)
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.log("Payment Intent Error:", error.message);

    res.status(500).json({
      error: "Payment failed"
    });
  }
};

const handleWebhook = async (req, res) => {

  const sig = req.headers["stripe-signature"];
  let event;

  try {

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {
    console.log("Signature Error:", err.message);
    return res.status(400).send("Webhook Error");
  }

  console.log("Webhook Type:", event.type);

  if (event.type === "payment_intent.succeeded") {

    const paymentIntent = event.data.object;

    console.log("PaymentIntent Metadata:", paymentIntent.metadata);

    const orderIds = JSON.parse(
      paymentIntent.metadata.orderIds
    );

    console.log("Updating Orders:", orderIds);

    await Order.updateMany(
      { _id: { $in: orderIds } },
      { status: "CONFIRMED" }
    );

    console.log("Orders Updated!");
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  handleWebhook
};