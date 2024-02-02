const bcrypt = require('bcrypt');
const usermodel = require('../models/user.model');

const getAllUsers = async (req, res) => { 
    const allUsers = await usermodel.find({});
    res.status(200).json({ allUsers });
};

const signup = async (req, res) => { 
    try {
        const { email, password } = req.body;
        
        await usermodel.findOne({ email: email })
            .then(async (existingUser) => { 
                if (existingUser) {
                    res.status(200).json({ msg: "User Already exist. Please login.", status: 0 });
                }
                else { 
                    await usermodel.create({
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: req.body.password,
                        userType: req.body.userType
                    }).then(() => {
                        res.status(200).json({ msg: "Your Account has been created successfully. Login to your account to get started.", status: 1 });
                    })
                }
            });
    } catch (error) {
        res.status(500).json({ msg: "Error: User could not be added", err: error, status: 0 });
    }    
};

const login = async (req, res) => { 
    try {
        const { email, password } = req.body;
        await usermodel.findOne({ email: email })
            .then(async (userFound) => { 
                if (userFound) {
                    bcrypt.compare(password, userFound.password, (error, same) => {
                        if (same) {
                            //console.log(userFound._id);
                            
                            req.session.userId = userFound._id.toString();
                            req.session.userType = userFound.userType;
                            // console.log(req.session.userId);
                            // console.log(req.session.userType);
                            let varusertype = 1;
                            if (userFound.userType == "admin") {
                                varusertype = 3;
                            } else if (userFound.userType == "craftsman") {
                                varusertype = 2;
                            } else {
                                varusertype = 1;
                            }
                            res.status(200).json({ msg: "Login Successful", status: 1, userType: varusertype});
                        } else {
                            res.status(200).json({ msg: "Password incorrect. Please try again with different password or try resetting a new password.", status: 0 });
                        }
                    });
                    //res.status(200).json({ msg: "Login Successful", status: 1 });
                    // start session
                } else {
                    res.status(200).json({ msg: "User Not Found! Please try with different email or sign up for new account.", status: 0 });
                }
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Login failed. Please try again later!", err: error, status: 0 });
    } 
}

module.exports = {getAllUsers, signup, login}