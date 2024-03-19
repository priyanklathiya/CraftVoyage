const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

const stripe = require("stripe")("sk_test_51OtC6IFJ9IYTcdSKN5kcQBP4CM0qqwi9CZDcauwvBkKKIcbraWYU33VB6Riwf98L04wpzq8pPRgDlYLzIf63I7jQ007SBChOQA");


// database connection
require('dotenv').config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri,
     { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connection Successfull'))
    .catch((err) => {
        console.error(err);
    });


const app = new express();
app.use(express.static(path.resolve(__dirname + '/public')))

const port = process.env.PORT || 8080;

app.use(cors({
    origin: ["http://localhost:3000","http://192.168.56.1:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(bodyParser.urlencoded())
app.use(express.json());
app.use(cookieParser());


// global session variable

app.use(expressSession({
    secret: 'session key abc', // secret key used to encrypt the session cookie
    // cookie: {
    //     secure: false,
    //     maxAge: 1000 * 60 * 60 * 24
    // }
}));

global.userId = null;
global.userType = null;

app.use("*",(req,res,next)=>{
    userId = req.session.userId;
    userType = req.session.userType;
    next();
})



// image path
app.use('/Images', express.static('Images'));

// Middlewares
const authentication = require('./middlewares/authMiddleware');
app.get('/auth/userSession', authentication.sessionUser);
app.get('/auth/logout', authentication.logout);

//  routers of the application
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const categoryRoutes = require('./routes/category');
const conditionRoutes = require('./routes/condition');
const cartRoutes = require('./routes/cart');
const blogsRoutes = require('./routes/blogs');
const ordersRoutes = require('./routes/orders');

// Login / Signup
app.use('/api/users', usersRoutes);

// admin

// category
app.use('/api/category', categoryRoutes);

// condition
app.use('/api/condition', conditionRoutes);

// craftsman
app.use('/api/products', productsRoutes);

// customer

// admin panel API

// cart
app.use('/api/cart', cartRoutes);

// blogs
app.use('/api/blogs', blogsRoutes);

// stripe

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;

    const line_items = products.map((product)=>({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
        },
        unit_amount: product.price * 100,
      },
      quantity: 1
    }));
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],   
      line_items: line_items,
      mode: "payment",
      success_url: "http://localhost:8080/success",
      cancel_url: "http://localhost:3000/cancel"
    });

      const payment = new

      res.status(200).json({ success: true, message: 'Successfully created', session });
      
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating checkout session' });
  }
});

// Order
// app.use('/api/orders', ordersRoutes);

app.get("/successfulPayment", async (req, res) => {
    const paymentSessionId = req.query.paymentSessionId;
    console.log(paymentSessionId);
    // console.log(req.session.paymentSId);
  // Retrieve session details from Stripe using the session ID
    // const session = await stripe.checkout.sessions.retrieve(req.session.paymentSessionId);
    // console.log(session);
  // Handle successful payment logic
});


app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`);
})