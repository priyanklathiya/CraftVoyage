const bcrypt = require('bcrypt');
const productsmodel = require('../models/products.model');

// const getAllProductsById = async (req, res) => {
//     try {
        
//         const userId = req.body.userId;
//         console.log(userId);
//         const product = await productsmodel.find({ _id: userId });
//         console.log(product);

//         res.status(200).json({ product });

//         if (!product) {
//             return res.status(404).json({ error: 'No Products found!' });
//         }
//         res.status(200).json({ product });
        
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

const getAllProductsById = async (req, res) => {
    const userId = req.body.userId;
    try {
        // Fetch products
        const product = await productsmodel.find({ userId: userId });

        if (!product) {
            return res.status(404).json({ error: 'No Products found!' });
        }
        
        res.status(200).json({ product });
        
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addProduct = async (req, res) => { 
    try {

        let _image = "default";
        if (req.files.image) {
            _image = "Images/products/"+req.files.image[0].filename;
        }

        await productsmodel.create({
            title: req.body.title,
            description: req.body.description,
            year: req.body.year,
            artist: req.body.artist,
            style: req.body.style,
            image: _image,
            condition: req.body.condition,
            price: req.body.price,
            quantity: req.body.quantity,
            additionalInformation: req.body.additionalInformation,
            userId: req.body.userId,
            dimensions: {
                height: req.body.height,
                width: req.body.width,
                depth: req.body.depth
            },
        }).then(() => {
            res.status(200).json({ msg: "Product Added Successfully", status: 1 });
        })
    } catch (error) {
        console.log(error);
        res.status(200).json({ msg: "Error: Product could not be added", err: error, status: 0 });
    }
};

const updateProduct = async (req, res) => { 
    try {
        // console.log(req.body);
        let _image = "default";
        if (req.files.image) {
             _image = "Images/products/"+req.files.image[0].filename;
        } else if (req.body.image) {
            _image = "Images/products/"+req.body.image;
        }
        // let _image = "default";
        // if (req.files.image) {
        //     _image = "Images/products/"+req.files.image[0].filename;
        // }

        // Create an object to hold the updated product data
        const updatedProductData = {
            title: req.body.title,
            description: req.body.description,
            year: req.body.year,
            artist: req.body.artist,
            style: req.body.style,
            image: _image,
            condition: req.body.condition,
            price: req.body.price,
            quantity: req.body.quantity,
            additionalInformation: req.body.additionalInformation,
            userId: req.body.userId,
            dimensions: {
                height: req.body.height,
                width: req.body.width,
                depth: req.body.depth
            },
        };

        // Check if any of the image paths are not default and update them
        // Check if image is not default and update it

        // if (_image !== 'default') {
        //     updatedProductData.imagePath = {
        //         ...updatedProductData.imagePath,
        //         image: _image
        //     };
        // }

    await productsmodel.findOneAndUpdate({ _id: req.body.productId }, updatedProductData ).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }    
};

const updateStatus = async (req, res) => { 
    try {
        const updatedProductData = {
            status: req.body.status,
        };
        await productsmodel.findOneAndUpdate({ _id: req.body.productId }, updatedProductData ).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
         res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }
}


module.exports = { getAllProductsById, addProduct, updateProduct, updateStatus }