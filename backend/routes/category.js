const express = require( "express");
const router = express.Router();

// Users API

const { getAllCategory, getCategoryById, addCategory, updateCategory, deleteCategory } = require("../controllers/category");

router.route("/getAllCategory").get(getAllCategory);
router.route("/addCategory").post(addCategory);
router.route("/UpdateCategory").post(updateCategory);
router.route("/deleteCategory").post(deleteCategory);

module.exports = router;