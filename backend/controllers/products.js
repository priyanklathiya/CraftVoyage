const productsmodel = require('../models/products.model');

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
            image: _image,
            categoryId: req.body.categoryId,
            conditionId: req.body.conditionId,
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
        
        let _image = "default";
        if (req.files.image) {
             _image = "Images/products/"+req.files.image[0].filename;
        } else if (req.body.image) {
            _image = req.body.image;
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
            image: _image,
            categoryId: req.body.categoryId,
            conditionId: req.body.conditionId,
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
        //     updatedProductData.image = {
        //         ...updatedProductData.image,
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
        // console.log(req.body.status, req.body.productId);
        await productsmodel.findOneAndUpdate({ _id: req.body.productId }, updatedProductData ).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
         res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }
}

const getAllProducts = async (req, res) => { 
    const allProducts = await productsmodel.find({});
    res.status(200).json({ allProducts });
};

const filterProducts = async (req, res) => {
    const categories = req.body.categories || [];
    const conditions = req.body.conditions || [];
    const sortBy = req.body.sortBy;


    try {
        let filterCriteria = {};

        // Handle filtering based on parameters
        if (conditions.length > 0) {
            // If conditions is an array, use $in operator
            filterCriteria.conditionId = { $in: conditions };
        }

        if (categories.length > 0) {
            // If categories is an array, use $in operator
            filterCriteria.categoryId = { $in: categories };
        }

        // Check if all parameters are empty, if yes, retrieve all products
        if (categories.length === 0 && conditions.length === 0 && !sortBy) {
            // console.log('Fetching all products');
            const products = await productsmodel.find({});
            return res.status(200).json({ products });
        }

        let products;

        // Fetch and filter products from the database based on the criteria
        if (sortBy === 'lowToHigh') {
            products = await productsmodel.find(filterCriteria).sort({ price: 1 });
        } else if (sortBy === 'highToLow') {
            products = await productsmodel.find(filterCriteria).sort({ price: -1 });
        } else if (sortBy === 'newest') {
            products = await productsmodel.find(filterCriteria).sort({ createdAt: -1 });
        } else {
            products = await productsmodel.find(filterCriteria);
        }

        // console.log(products);

        res.status(200).json({ products });

    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProductByPId = async (req, res) => {
    const productId = req.body.productId;
    try {
        const product = await productsmodel.findOne({ _id: productId }); // Use the id variable in your query

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllProductsById, addProduct, updateProduct, updateStatus, getAllProducts, filterProducts, getProductByPId }