const express = require( "express");
const router = express.Router();

// Users API

const { getCart, removeFromCart, addCart } = require("../controllers/cart");

router.route("/getCart").post(getCart);
router.route("/addCart").post(addCart);
router.route("/removeFromCart").post(removeFromCart);

module.exports = router;