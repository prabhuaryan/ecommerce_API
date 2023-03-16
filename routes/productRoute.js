const router=require('express').Router()
const { verifyAdmin } = require('../middleware/verifyToken');
const Product=require('../models/Product.model');

//CREATE Product

router.post('/create',verifyAdmin,async (req, res)=>{
    const product= new Product(req.body)
    try{
        const savedProduct= await product.save();
        return res.status(200).json(savedProduct);
    }catch(err){
        return res.status(500).json(err);
    }
});

//GET Product BY ID

router.get('/:id', async (req, res)=>{
    try{
        const product= await Product.findById(req.params.id);
        return res.status(200).json(product);
    }catch(err){
        return res.status(500).json(err);
    }
});

//GET all Products

router.get('/', async (req, res)=>{
    const query=req.query.new;
    const category=req.query.category;
    try{
        let products;
        if(query){
            products= await Product.find().sort({createdAt:-1}).limit(5)
        }
        else if(category){
            products= await Product.find({categories:{
                $in:[category]
            }})
        }
        else {
            products = await Product.find({})
        }
        return res.status(200).json(products);
    }catch(err){
        return res.status(500).json(err);
    }
});

//UPDATE Product

router.put('/:id', verifyAdmin, async (req, res)=>{
    try {
        const updateProduct= await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        return res.status(200).json(updateProduct);
    }catch(err){
        return res.status(500).json(err);
    }
});

//DELETE Product

router.delete('/:id', verifyAdmin, async (req, res)=>{
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        message:"Product has been deleted"
    })
})
module.exports=router;