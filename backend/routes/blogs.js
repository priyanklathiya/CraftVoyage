const express = require( "express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images/blogs');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()  + '_' +  file.originalname);
    }
})

const upload = multer({
    storage: storage,
})

// Users API

const { getAllBlogs, getBlogsByUserId, removeBlog, addBlog, updateBlog } = require("../controllers/blogs");

router.route("/getAllBlogs").get(getAllBlogs);

router.route("/getBlogsByUserId").post(getBlogsByUserId);

router.route("/addBlog").post(
    upload.fields([{ name: 'image', maxCount: 1 },        
    ]), addBlog);

router.route("/updateBlog").post(
    upload.fields([{ name: 'image', maxCount: 1 },
    ]), updateBlog);


router.route("/removeBlog").post(removeBlog);

module.exports = router;