const User = require('../models/user.model.js')

const sessionUser = (req, res) => {
    // console.log(req.session);
    // console.log(req.session.userType);
    try {
        if (req.session.userId) {
            res.status(200).json({ valid: true, userType: req.session.userType, userId: req.session.userId });
        } else {
            res.status(200).json({ valid: false });
        }
    }
    catch(err){
        // console.error(err);
        res.json({ valid: false, err:err });  
    }
}

const logout = (req, res) => {
    // console.log(req.session);
    // console.log(req.session.userType);
    try {
        req.session.destroy(() => {
            res.status(200).json({ valid: false, msg:"user logged out.", logStatus: 0 });
        })
    }
    catch(err){
        console.error(err);
        res.json({ valid: false, err:err });  
    }
}

module.exports = {sessionUser,logout};