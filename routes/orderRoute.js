const { verifyToken, verifyTokenAndAuthorization, verifyAdmin } = require('../middleware/verifyToken');
const Order=require('../models/Order.model')
const router=require('express').Router()


//CREATE Order

router.post('/create',verifyToken,async (req, res)=>{
    try{
        const order= await new Order(req.body).save()
        return res.status(200).json(order);
    }catch(err){
        return res.status(500).json(err);
    }
});

//UPDATE Order

router.put('/:id', verifyAdmin, async (req, res)=>{
    try {
        const updateOrder= await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        return res.status(200).json(updateOrder);
    }catch(err){
        return res.status(500).json(err);
    }
});

//GET USer Order
router.get('/:userId',verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const orders= await Order.find({userId:req.params.userId});
        return res.status(200).json(orders);
    }catch(err){
        return res.status(500).json(err);
    }
});
//All Orders
router.get('/', verifyAdmin,async (req, res)=>{
    try{
        const orders=await Order.find({})
        return res.status(200).json(orders);
    }catch(err){
        return res.status(500).json(err);
    }
})

//DELETE Cart

router.delete('/:id', verifyAdmin, async (req, res)=>{
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        message:"Order has been deleted"
    })
});

router.get("/income", verifyAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports=router;