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

// Order
app.use('/api/orders', ordersRoutes);


// stripe
const orderModel = require('./models/order.model');
const cartModel = require('./models/cart.model');
const productsmodel = require('./models/products.model');

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { products, userId } = req.body;

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
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      metadata: {
        userId: userId
      }
    });

      res.status(200).json({ success: true, message: 'Successfully created', session });
      
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating checkout session' });
  }
});

const endpointSecret = "whsec_Qy8lsIbgo7ClRO1AbyMkRCxwQCFDJ1SC";

// Listen for the checkout.session.completed event
app.post("/webhook/stripe", async (req, res) => {
  let event;

  try {
    event = req.body;
    
  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

          // Retrieve user ID from metadata
      const userId = session.metadata.userId;

    // get cart details
    const cartDetails = await cartModel.find({ userId: userId });
    // Array to store final result
    const resultArray = [];

    // Iterate over cart details
    for (const cartItem of cartDetails[0].cartDetails) {
        // Fetch product details using productId
        const productDetails = await productsmodel.findOne({ _id: cartItem.productId });

        if (productDetails) {
            // Construct new object with required details
            const newItem = {
                title: productDetails.title,
                productId: productDetails._id,
                price: productDetails.price,
                // artist: productDetails.artist,
                // year: productDetails.year,
            };

            // Push the new item to the result array
            resultArray.push(newItem);
        }
    }
    

    // Iterate over cart details
    

    const orderDetails = [];

        // Iterate through cartData to populate orderDetails
        resultArray.forEach((cartItem) => {
            orderDetails.push({
                title: cartItem.title,
                productId: cartItem.productId,
                price: cartItem.price,
            });
        });


    // save order
    const order = await orderModel.create({
      userId: userId,
      orderDetails: orderDetails,
      totalAmount: session.amount_total,
      paymentIntent: session.payment_intent,
      paymentId: session.id,
      paymentStatus: session.payment_status,
    });
    
    // delete cart

    await cartModel.deleteOne({ userId: userId });
        
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });

    
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


});


// Listen to port 8080

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`);
})