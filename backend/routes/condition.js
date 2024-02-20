const express = require( "express");
const router = express.Router();

// Users API

const { getAllCondition, getConditionById, addCondition, updateCondition, deleteCondition } = require("../controllers/condition");

router.route("/getAllCondition").get(getAllCondition);
router.route("/addCondition").post(addCondition);
router.route("/updateCondition").post(updateCondition);
router.route("/deleteCondition").post(deleteCondition);

module.exports = router;