const User = require("../models/User");

// Middleware to check if user is Admin

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.headers["userid"];

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access only" });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Middleware to check if user is Customer
const isCustomer = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "customer") {
      return res.status(403).json({ error: "Access denied, Customers only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { isAdmin, isCustomer };