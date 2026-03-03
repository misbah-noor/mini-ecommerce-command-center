const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce_products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = multer({ storage });