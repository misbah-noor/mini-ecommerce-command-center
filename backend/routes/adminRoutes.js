const express = require("express");
const { getAnalytics } = require("../controllers/adminController");

const router = express.Router();

router.get("/admin/analytics", getAnalytics);

module.exports = router;