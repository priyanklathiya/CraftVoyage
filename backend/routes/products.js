const express = require( "express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()  + '_' +  file.originalname);
    }
})

const upload = multer({
    storage: storage,
})

// Products API

const { getAllProductsById, addProduct, updateProduct, updateStatus, getAllProducts, filterProducts, getProductByPId} = require("../controllers/products");

router.route("/getAllProductsById").post(getAllProductsById);

router.route("/addProduct").post(
    upload.fields([{ name: 'image', maxCount: 1 },        
    ]), addProduct);


router.route("/updateProduct").post(
    upload.fields([{ name: 'image', maxCount: 1 },
    ]), updateProduct);

router.route("/updateStatus").post(updateStatus);

router.route("/getAllProducts").get(getAllProducts);

router.route("/filterProducts").post(filterProducts);

router.route("/filterProducts").post(filterProducts);

router.route("/getProductByPId").post(getProductByPId);

module.exports = router;