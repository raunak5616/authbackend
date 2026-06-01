import { User } from "../mongo/model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const buildUserPayload = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    bestScore: user.bestScore ?? 0,
    gamesPlayed: user.gamesPlayed ?? 0,
    coins: user.coins ?? 0,
});

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
            user: buildUserPayload(user),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const normalizedEmail = email?.trim().toLowerCase();
        const user = await User.findOne({email: normalizedEmail});
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
        token,
        user: buildUserPayload(user),
    });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }   
};

export const saveScore = async (req, res) => {
    const { score } = req.body;

    if (!Number.isFinite(score) || score < 0) {
        return res.status(400).json({ message: "Valid score is required" });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.gamesPlayed += 1;
        user.bestScore = Math.max(user.bestScore ?? 0, score);
        user.coins += score * 5;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Score saved",
            user: buildUserPayload(user),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({}, "name bestScore gamesPlayed coins")
            .sort({ bestScore: -1, coins: -1, gamesPlayed: 1, name: 1 })
            .limit(10)
            .lean();

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            id: user._id,
            name: user.name,
            bestScore: user.bestScore ?? 0,
            gamesPlayed: user.gamesPlayed ?? 0,
            coins: user.coins ?? 0,
        }));

        res.status(200).json({
            success: true,
            leaderboard,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
