const blogsmodel = require('../models/blogs.model');

const addBlog = async (req, res) => { 
    try {

        let _image = "default";
        if (req.files.image) {
            _image = "Images/blogs/"+req.files.image[0].filename;
        }

        await blogsmodel.create({
            title: req.body.title,
            description: req.body.description,
            articleBody: req.body.articleBody,
            userId: req.body.userId,
            image: _image,
        }).then(() => {
            res.status(200).json({ msg: "Blog Added Successfully", status: 1 });
        })
    } catch (error) {
        console.log(error);
        res.status(200).json({ msg: "Error: Blog could not be added", err: error, status: 0 });
    }
};

const updateBlog = async (req, res) => { 
    try {
        
        let _image = "default";
        if (req.files.image) {
             _image = "Images/blogs/"+req.files.image[0].filename;
        } else if (req.body.image) {
            _image = req.body.image;
        }
        // Create an object to hold the updated blog data
        const updatedBlogData = {
            title: req.body.title,
            description: req.body.description,
            articleBody: req.body.articleBody,
            userId: req.body.userId,
            image: _image,
        };

    await blogsmodel.findOneAndUpdate({ _id: req.body.blogId }, updatedBlogData ).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }    
};

const getBlogsByUserId = async (req, res) => {
    const userId = req.body.userId;
    try {
        // Fetch products
        const blog = await blogsmodel.find({ userId: userId });

        if (!blog) {
            return res.status(404).json({ error: 'No Blogs found!' });
        }
        
        res.status(200).json({ blog });
        
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllBlogs = async (req, res) => { 
    const allblogs = await blogsmodel.find({});
    res.status(200).json({ allblogs });
};

const removeBlog = async (req, res) => {
    try {
        await blogsmodel.findOneAndDelete({ _id: req.body.blogId })
            
            .then((data) => {
                if (data) {
                    res.status(200).json({ msg: "Data deleted successfully.", status: 1 });                    
                } else {
                    res.status(400).json({ msg: "Error: data cannot be deleted", status: 0 });
                }
            })
            .catch((err) => {
                // console.log(err);
                res.status(400).json({ msg: "Error: data cannot be deleted", err: err, status: 0 });
            })
    } catch (error) {
        // console.log(error);
        res.status(400).json({ msg: "Error: brand cannot be deleted", err: error, status: 0 });
    }

}



module.exports = { getAllBlogs, getBlogsByUserId, removeBlog, addBlog, updateBlog }