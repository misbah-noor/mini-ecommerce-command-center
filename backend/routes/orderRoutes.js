const express = require("express");
const Order = require("../models/Order");
const {
  placeOrder,
  getOrders,
  getUserOrders,
  deleteOrder,
  updateOrderQuantity,
} = require("../controllers/OrderController");

const router = express.Router();

// All routes will internally have /orders prefix
// So in frontend, /api/orders/... still works

// POST /api/orders → only customer can place
router.post("/orders", placeOrder);

// GET /api/orders → get all orders for admin
router.get("/orders", getOrders);

// GET /api/orders/user-orders → get orders for a specific user
router.get("/orders/user-orders", getUserOrders);

// DELETE /api/orders/:orderId → remove an order
router.delete("/orders/:orderId", deleteOrder);

// PUT /api/orders/:orderId → update quantity
router.put("/orders/:orderId", updateOrderQuantity);

// PATCH /api/orders/:id/status → update order status
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    console.log("----- PATCH HIT -----");
    console.log("Order ID:", req.params.id);
    console.log("Status Received:", status);

    const order = await Order.findById(req.params.id);

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    console.log("Updated Order:", order);

    res.json(order);
  } catch (err) {
    console.log("PATCH ERROR:", err);
    res.status(500).json({ message: "Status update failed" });
  }
});

console.log("Order route loaded");
module.exports = router;