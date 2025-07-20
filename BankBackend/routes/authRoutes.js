import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(500).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(500).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user
    const user = new User({ username: username, email: email, password: hashedPassword });
    await user.save();

    // Creating a unique bank account number

    res.status(201).json({ msg: "New user created successfully", user });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(500).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    const isUser = await bcrypt.compare(password, user.password);
    if (!isUser) {
        return res.status(400).json({ msg: "Incorrect password" });
    }

    const token = generateToken(user);

    res.status(201).json({ msg: "Logging in successfully", user, token });
});

export default router;