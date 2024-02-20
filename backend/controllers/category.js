const categorymodel = require('../models/categories.model');

const getAllCategory = async (req, res) => { 
    const allCategory = await categorymodel.find({});
    res.status(200).json({ allCategory });
};


const getCategoryById = async (req, res) => { 
    const categoryId = req.params.categoryId;
    const category = await categorymodel.findById(categoryId);

    if (!category) {
        return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ category });
};


const addCategory = async (req, res) => { 
    try {
        await categorymodel.create({
            categoryName: req.body.categoryName
        }).then(() => {
            res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }
};

const deleteCategory = async (req, res) => {
    try {

        const updatedCategoryData = {
            status: req.body.status,
        };

        await categorymodel.findOneAndUpdate({ _id: req.body.categoryId }, updatedCategoryData)
            
            .then((data) => {
                if (data) {
                    res.status(200).json({ msg: "Data updated successfully.", status: 1 });
                } else {
                    res.status(400).json({ msg: "Error: Category cannot be updated", status: 0 });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ msg: "Error: Category cannot be updated", err: err, status: 0 });
            })
    } catch (error) {
        // console.log(error);
        res.status(400).json({ msg: "Error: Category cannot be deleted", err: error, status: 0 });
    }
}

const updateCategory = async (req, res) => { 
    try {
        // console.log(req.body);
        
        await categorymodel.findOneAndUpdate({ _id: req.body.categoryId }, {
            categoryName: req.body.categoryName
        }).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }    
};

module.exports = {getAllCategory, getCategoryById, addCategory, updateCategory, deleteCategory}