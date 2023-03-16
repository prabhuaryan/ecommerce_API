const jwt=require('jsonwebtoken');

const verifyToken=(req, res, next)=>{
    const authHeader=req.headers.token;
    if(!authHeader){
        
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const token= authHeader.split(" ")[1];
    jwt.verify(token,process.env.JWT_SECRET,(err, user)=>{
        if(err){
            return res.status(401).json({
                message:"Invalid token"
            })
        }
        req.user=user;
        next()

    })
}

const verifyTokenAndAuthorization=(req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next()
        }
        else{
            return res.status(401).json({
                message:"You are not allowed to do! as only admin can change"
            })
        }
    })
}

const verifyAdmin=(req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next()
        }
        else{
            return res.status(401).json({
                message:"You are not allowed to do! as only admin can access!"
            })
        }
    })
}


module.exports={verifyToken, verifyAdmin, verifyTokenAndAuthorization};