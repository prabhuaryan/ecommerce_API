const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const app=express();
const dbConnection=require('./config/db.js');
const userRoute=require('./routes/userRoute');
const authRoute=require('./routes/auth');
const productRoute=require('./routes/productRoute');
const cartRoute=require('./routes/cartRoute');
const orderRoute=require('./routes/orderRoute');
const paymentRoute=require('./routes/paymentRoute')

//DOTENV CONFIG
dotenv.config();

//DB Connection
dbConnection();

//CORS Issue fixed
app.use(cors());
//JSON Data
app.use(express.json());

//REST TEST ROUTE
app.get('/',(req, res)=>{
res.status(200).send({
    message:"Welcome to E-commerce REST API",
})
});

//REST APIs ENDPOINTs
app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/product',productRoute);
app.use('/api/cart',cartRoute);
app.use('/api/order',orderRoute);
app.use('/api/payment', paymentRoute);


//APP listing on PORT
app.listen(process.env.PORT||3000,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});