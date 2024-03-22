const express = require( "express");
const router = express.Router();


const {
    getOrderHistory, 
    getOrderHistoryByUser,
    getOrderById,
  } = require("../controllers/orders");

router.route("/getOrderHistory").get(getOrderHistory);
router.route("/getOrderHistoryByUser").post(getOrderHistoryByUser);
router.route("/getOrderById").post(getOrderById);

module.exports = router;