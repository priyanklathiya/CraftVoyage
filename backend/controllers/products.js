const bcrypt = require('bcrypt');
const productsmodel = require('../models/products.model');

const getAllProductsById = async (req, res) => { 
    try {
        
        const userId  = req.body.userId; 
        const product = await productsmodel.find({ _id: userId });
        res.status(200).json({ product });

        if (!product) {
            return res.status(404).json({ error: 'No Products found!' });
        }
        res.status(200).json({ product });        
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addProduct = async (req, res) => { 
    try {

        let _image = "default";
        if (req.files.imagePath1) {
            _image = req.files.image[0].filename;
        }

        await productsmodel.create({
            title: req.body.title,
            description: req.body.description,
            year: req.body.year,
            artist: req.body.artist,
            style: req.body.style,
            images: _image,
            condition: req.body.condition,
            price: req.body.price,
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


module.exports = { getAllProductsById, addProduct }