const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


//App
const app = express();

//webhook route 
const webhookRoutes = require("./routes/webhookRoutes");
app.use("/api", webhookRoutes);
console.log("POST: /api/webhook");


app.use(express.json());

//CORS middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mini-ecommerce-command-center.vercel.app",
  ],
  credentials: true
}));


//MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("database connection failed", err));

   mongoose.connection.once("open", ()=>{
    console.log("Connected to DB:", mongoose.connection.name);
   });
   
//show method and url in terminal
app.use((req, res, next) => {
  console.log("REQ HIT: ", req.method, req.url);
  next();
})


//order route 
const orderRoutes = require("./routes/orderRoutes");
app.use("/api", orderRoutes);
console.log("POST: /api/orders");

//payment route
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api", paymentRoutes);
console.log("POST: /api/payment");

//product route
const productRoutes = require("./routes/productRoutes");
app.use("/api", productRoutes);
console.log("POST: /api/products");

//user route
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);
console.log("POST: /api/users");

//admin route
const adminRoutes = require("./routes/adminRoutes");
app.use("/api", adminRoutes);
console.log("GET: /api/analytics");

//runs in terminal
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 