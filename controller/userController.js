import { User } from "../mongo/model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const trimmedName = name?.trim();
        const normalizedEmail = email?.trim().toLowerCase();

        if (!trimmedName || !normalizedEmail || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: trimmedName,
            email: normalizedEmail,
            password: hashpassword
        });

        const token = jwt.sign({
            id: user._id,
            email: user.email},
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            },
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }       
        const token =jwt.sign({
            id:user._id,
            email:user.email},
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            },
    );
    res.status(200).json({
        success:true,
        message: "Login successful",
        token, });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }   
};
