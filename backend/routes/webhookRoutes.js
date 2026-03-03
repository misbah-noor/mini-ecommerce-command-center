const express = require("express");
const { handleWebhook } = require("../controllers/paymentController");  
const router = express.Router();

// stripe webhook requires raw body
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);
console.log("Webhook route loaded");

module.exports = router;