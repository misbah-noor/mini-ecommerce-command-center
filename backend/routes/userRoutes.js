const User = require("../models/User");
const express = require("express");


const router = express.Router();

//post users
router.post("/users", async (req, res) => {
  try {

    const existing = await User.findOne({ email: req.body.email });
    if(existing){
      return res.status(400).json({error:"User with this email already exists."});
    }
    

    const user = new User(req.body);
    await user.save();

    console.log("User created:", user);

    res.status(201).json(user); // send actual user object

  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Successfully logged in
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users", async(req, res) => {
  try{
    const users = await User.find();
    res.json(users);
    console.log("User fetched: ", users);
  } catch(error) {
    res.status(500).send(error.message);
  } 
});



module.exports = router;