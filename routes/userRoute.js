const router=require('express').Router();
const {verifyTokenAndAuthorization, verifyAdmin}=require('../middleware/verifyToken')
const bcrypt=require('bcrypt');
const User=require('../models/User.model');

//GET All Users

router.get('/',verifyAdmin, async (req, res)=>{
    const query= req.query.new;
    try{
        const users= query ? await User.find({}).sort({_id:-1}).limit(5):await User.find({})
        return res.status(200).json(users);
    }catch(err){
        return res.status(500).json(err);
    }
});

//GET USER by ID

router.get('/:id', verifyAdmin, async (req, res)=>{
    try{
        const user= await User.findById(req.params.id);
        const {password, ...result}=user._doc;
        return res.status(200).json(result);
    }catch(err){
        return res.status(500).json(err);
    }
});

//UPDATE USER

router.put('/:id',verifyTokenAndAuthorization,async (req, res)=>{
    let hashedPassword;
    if(req.body.password){
       hashedPassword =await bcrypt.hash(req.body.password,10);
       req.body.password=hashedPassword;
    }
    try {
        const updateUser= await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        return res.status(200).json(updateUser);
    }catch(err){
        return res.status(500).json(err);
    }
});
//DELETE USER
router.get("/stats", verifyAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.delete('/:id', verifyAdmin, async (req, res)=>{
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        message:"User has been deleted"
    })
})

module.exports=router;