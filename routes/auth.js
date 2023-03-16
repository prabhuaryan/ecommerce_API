const router=require('express').Router();
const User=require('../models/User.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

//Register

router.post('/register',async (req, res)=>{
const {username, name, email, password}=req.body;
const isExists= await User.findOne({username:username});
try{
if(!isExists){
    const hashedPassword= await bcrypt.hash(password,10);
    const user= new User({
        username,
        name,
        email,
        password:hashedPassword
    });
        const savedUser= await user.save();
      return  res.status(201).json(savedUser);
    }
    else {
       return res.status(500).json({
            message:"User already exists!"
        });
    }
}
catch(err){
   return res.status(500).json(err);
    console.log(err);
}
});

//Login

router.post('/login',async (req, res)=>{
        const user= await User.findOne({username:req.body.username});
        if(!user){
           return  res.status(500).json({
                message:"Invalid username and password"
            })
        }
        const matchedPassword=await bcrypt.compare(req.body.password, user.password);
        if(!matchedPassword){
           return res.status(500).json({
                message:"Invalid username and password"
            })
        }
       const access_token=jwt.sign({
        id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin
       },process.env.JWT_SECRET,{expiresIn:"24h"})
       const {password, ...other}=user._doc;
       return res.status(200).json({access_token,user:other});
   
})

module.exports=router;