const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json(
                {
                    success: false,
                    message: "Please provide all the required fields"
                });
        }
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json(
                {
                    success: false,
                    message: "User with this email already exists"
                });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    }
    catch(e){
        return res.status(500).json(
            {
                success: false,
                message: "Unable to register user",
                error: e.message
            }
        );
    }
};


const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;    
        if(!email || !password){   
            return res.status(400).json( //early return pattern
                {
                    success: false,
                    message: "Please provide all the required fields"
                });
        }
       
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json(
                {
                    success: false,
                    message: "User with this email does not exist"
                });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid credentials"
                });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch(e){
        return res.status(500).json(
            {
                success: false,
                message: "Unable to login user",
                error: e.message
            }
        );

    }
};

module.exports = { registerUser , loginUser };