const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

// PLACE ORDER WITH TRANSACTION
const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user, product, quantity } = req.body;
    if (!user || !product || !quantity)
      throw new Error("Missing required fields");

    const foundProduct = await Product.findById(product).session(session);
    if (!foundProduct) throw new Error("Product not found");

    // Choose warehouse
    const warehouses = ["A", "B", "C"];
    let chosenWarehouse = null;
    for (let key of warehouses) {
      if (foundProduct.warehouses[key] >= quantity) {
        chosenWarehouse = key;
        break;
      }
    }
    if (!chosenWarehouse) throw new Error("Insufficient stock");

    // Deduct stock
    foundProduct.warehouses[chosenWarehouse] -= quantity;
    await foundProduct.save({ session });

    // Create order
    const order = new Order({
      user,
      product: foundProduct._id,
      quantity,
      totalPrice: foundProduct.price * quantity,
      warehouseUsed: chosenWarehouse,
      status: "PENDING",
    });

    await order.save({ session });
    await order.populate("product user");

    await session.commitTransaction();
    session.endSession();

    console.log("Order created:", order);
    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log("Place order error:", err);
    res.status(400).json({ error: err.message });
  }
};

// GET ALL ORDERS FOR ADMIN
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("product", "name price image")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    console.log("Orders found:", orders);
    res.json(orders);
  } catch (err) {
    console.log("GET /orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// GET ORDERS FOR SPECIFIC USER
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const orders = await Order.find({ user: userId })
      .populate("product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ error: "Missing orderId" });

    await Order.findByIdAndDelete(orderId);
    res.json({ message: "Order removed" });
  } catch (err) {
    console.log("Delete order error:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

// UPDATE ORDER QUANTITY
const updateOrderQuantity = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { quantity } = req.body;
    if (!orderId || !quantity) throw new Error("Missing required fields");

    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error("Order not found");

    const product = await Product.findById(order.product).session(session);
    if (!product) throw new Error("Product not found");

    const warehouse = order.warehouseUsed;
    const diff = quantity - order.quantity; // new - old
    if (diff > 0 && product.warehouses[warehouse] < diff)
      throw new Error("Insufficient stock in warehouse");

    product.warehouses[warehouse] -= diff;
    await product.save({ session });

    order.quantity = quantity;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    await order.populate("product");
    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log("Update order error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getUserOrders,
  deleteOrder,
  updateOrderQuantity,
};