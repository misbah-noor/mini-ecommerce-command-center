const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
    required: true,
  }
});

module.exports = mongoose.model("User", userSchema);