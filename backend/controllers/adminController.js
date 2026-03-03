const Order = require("../models/Order");
const Product = require("../models/Product");

const getAnalytics = async (req, res) => {
  try {
    // Only confirmed orders
    const confirmedOrders = await Order.find({ status: "CONFIRMED" });

    const totalSales = confirmedOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    const totalOrders = confirmedOrders.length;

    // Get stock info
    const products = await Product.find();

    const stockData = products.map((product) => ({
      name: product.name,
      stock:
        product.warehouses.A +
        product.warehouses.B +
        product.warehouses.C,
    }));

    res.json({
      totalSales,
      totalOrders,
      stockData,
    });
  } catch (err) {
    console.log("Analytics error:", err);
    res.status(500).json({ error: "Failed to load analytics" });
  }
};

module.exports = { getAnalytics };