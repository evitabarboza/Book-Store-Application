const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//Sign Up functionality for user
router.post("/sign-up", async(req, res) => {
    try {
        const {email, username, password, address} = req.body;

        //check if username has length > 4
        if(username.length < 4)
        {
            return res
            .status(400)
            .json({message: "Username length should be greater than 3"});
        }

        //Check if username already exists
        const existingUsername = await User.findOne({username: username});
        if(existingUsername) {
            return res
            .status(400)
            .json({message: "Username already exists"});
        }

        //Check if email already exists
        const existingEmail = await User.findOne({email: email});
        if(existingEmail) {
            return res
            .status(400)
            .json({message: "Email already exists"});
        }

        //Check password's length
        if(password.length <= 5) {
            return res
            .status(400)
            .json({message: "Password's length should be greater than 5"});
        }

        //Protecting the password
        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });
        await newUser.save();
        return res.status(200).json({message: "SignUp Successfully"});

    } catch(error) {
        res.status(500).json({message:"Internal server error"});
    }
});

//Sign In functionality for user
router.post("/sign-in", async(req, res) => {
    try {
        const {username, password} = req.body;

        const existingUser = await User.findOne({username});
        if(!existingUser){
            res.status(400).json({message:"Invalid credentials"});
        }

        //if user already exists
        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if(data)
            {
                //jwt token
                const authClaims = [
                    {name: existingUser.username},
                    {role: existingUser.role},
                ]
                const token = jwt.sign({authClaims}, "bookStore123", {
                    expiresIn: "30d",
                });
                res.status(200).json({
                    id: existingUser._id, 
                    role: existingUser.role, 
                    token: token,
                });
            }
            else {
                res.status(400).json({message: "Invalid Credentails"});
            }
        });
    } catch(error) {
        res.status(500).json({message:"Internal server error"});
    }
});


module.exports = router;