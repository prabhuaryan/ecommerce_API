const router=require('express').Router();
const stripe=require('stripe')(process.env.STRIPE_KEY);

router.post('/payment', async (req, res)=>{
    stripe.charges.create({
        source:req.body.tokenId,
        amount:req.body.amount,
        currency:"INR",
    }, (err, data)=>{
        if(err){
            return res.status(500).json(err)
        }
        return res.status.json(data)
    })
})

module.exports=router;