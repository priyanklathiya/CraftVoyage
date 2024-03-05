const cartmodel = require('../models/cart.model');
const productsmodel = require('../models/products.model');


const addCart = async (req, res) => {
    const { userId, cartDetails } = req.body;

    try {
        // Check if a cart entry with the same userId already exists
        const existingCart = await cartmodel.findOne({ userId });

        if (existingCart) {
            // If cart entry exists, check for productId in cartDetails
            const existingProduct = await cartmodel.findOne({ "cartDetails.productId": cartDetails[0].productId});
            
            if (existingProduct) {
                // If product with the same productId exists, throw an message

                res.status(200).json({ msg: "Item already in cart!", statuscode: 3 });
                
            } else {
                // If product with the same productId and size doesn't exist, add the data

                res.status(200).json({ msg: "Product is already in the cart.", statuscode: 3 });

            }
            
        } else {
            // If cart entry does not exist, create a new cart entry
            await cartmodel.create({ userId, cartDetails });
            res.status(200).json({ msg: "Data inserted successfully.", statuscode: 1 });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, statuscode: 0 });
    }
};
    

const getCart = async (req, res) => {
    const userId = req.body.userId;

    try {
        // Fetch cart details
        const cartDetails = await cartmodel.find({ userId: userId });

        if (cartDetails) {
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
                        description: productDetails.description,
                        productId: productDetails._id,
                        price: productDetails.price,
                        artist: productDetails.artist,
                        year: productDetails.year,
                        image: productDetails.image,
                        dimensions: {
                            height: productDetails.dimensions.height,
                            width: productDetails.dimensions.width,
                            depth: productDetails.dimensions.depth,
                        },
                    };

                    // Push the new item to the result array
                    resultArray.push(newItem);
                }
            }

            // Send the result array to the user
            res.status(200).json({ cartDetails: resultArray });
        } else {
            res.status(200).json({ cartDetails: [] }); // or handle as needed
        }
    } catch (error) {
        console.error('Error fetching cart details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const removeFromCart = async (req, res) => { 
    try {
        const { userId, productId } = req.body;
        // console.log(userId, productId, size);
        
        const cartDetails = await cartmodel.findOne({ userId: userId });
        if (cartDetails) {
            await cartmodel.updateOne({
                userId,
                "cartDetails.productId": productId
            }, {
                $pull: {
                    cartDetails: { productId: productId }
                }
            }).then(() => {
                res.status(200).json({ message: 'Item removed from the cart successfully', status: 1 });
            });
        } else {
            res.status(404).json({ msg: "No Data found to update", status: 3 });
        }

        
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }    
};

module.exports = {
    addCart, 
    getCart, 
    removeFromCart,
}