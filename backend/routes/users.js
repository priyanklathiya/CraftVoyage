const express = require( "express");
const router = express.Router();

// Users API

const { getAllUsers, signup, login } = require("../controllers/users");

router.route("/").get(getAllUsers);
router.route("/signup").post(signup);
router.route("/login").post(login);

module.exports = router;