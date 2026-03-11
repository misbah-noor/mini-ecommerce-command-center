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