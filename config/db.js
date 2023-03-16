const mongoose=require('mongoose');
const dbConnection=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology:true, useNewUrlParser:true});
        console.log("connected to db");
    }catch(err){
        console.log(err);
    }
}

module.exports=dbConnection;