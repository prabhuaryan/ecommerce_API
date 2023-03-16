const { verifyToken, verifyTokenAndAuthorization, verifyAdmin } = require('../middleware/verifyToken');
const Cart=require('../models/Cart.model')
const router=require('express').Router()


//CREATE CART

router.post('/create',verifyToken,async (req, res)=>{
    try{
        const cart= await new Cart(req.body).save()
        return res.status(200).json(cart);
    }catch(err){
        return res.status(500).json(err);
    }
});



//UPDATE Cart

router.put('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try {
        const updateCart= await Cart.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        return res.status(200).json(updateCart);
    }catch(err){
        return res.status(500).json(err);
    }
});

//GET USer Cart
router.get('/:userId',verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const cart= await Cart.findOne({userId:req.params.userId});
        return res.status(200).json(cart);
    }catch(err){
        return res.status(500).json(err);
    }
});

router.get('/', verifyAdmin,async (req, res)=>{
    try{
        const carts=await Cart.find({})
        return res.status(200).json(carts);
    }catch(err){
        return res.status(500).json(err);
    }
})

//DELETE Cart

router.delete('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        message:"Cart has been deleted"
    })
})



module.exports=router;