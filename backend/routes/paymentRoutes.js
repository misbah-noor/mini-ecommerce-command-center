const express = require("express");
const { createPaymentIntent } = require("../controllers/paymentController");
const router = express.Router();

router.post("/payment", createPaymentIntent);
console.log("Payment route loaded"); 

module.exports = router;