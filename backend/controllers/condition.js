const conditionmodel = require('../models/condition.model');

const getAllCondition = async (req, res) => { 
    const allCondition = await conditionmodel.find({});
    res.status(200).json({ allCondition });
};


const getConditionById = async (req, res) => { 
    const conditionId = req.params.conditionId;
    const condition = await conditionmodel.findById(conditionId);

    if (!condition) {
        return res.status(404).json({ error: "condition not found" });
    }

    res.status(200).json({ condition });
};


const addCondition = async (req, res) => { 
    try {
        await conditionmodel.create({
            conditionName: req.body.conditionName
        }).then(() => {
            res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }
};

const deleteCondition = async (req, res) => {
    try {

        const updatedConditionData = {
            status: req.body.status,
        };

        await conditionmodel.findOneAndUpdate({ _id: req.body.conditionId }, updatedConditionData)
            
            .then((data) => {
                if (data) {
                    res.status(200).json({ msg: "Data updated successfully.", status: 1 });
                } else {
                    res.status(400).json({ msg: "Error: Condition cannot be updated", status: 0 });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ msg: "Error: Condition cannot be updated", err: err, status: 0 });
            })
    } catch (error) {
        // console.log(error);
        res.status(400).json({ msg: "Error: Condition cannot be deleted", err: error, status: 0 });
    }
}

const updateCondition = async (req, res) => { 
    try {
        // console.log(req.body);
        
        await conditionmodel.findOneAndUpdate({ _id: req.body.conditionId }, {
            conditionName: req.body.conditionName
        }).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }    
};

module.exports = {getAllCondition, getConditionById, addCondition, updateCondition, deleteCondition}