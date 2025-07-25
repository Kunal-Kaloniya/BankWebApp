import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Account } from "../models/account.model.js";
import { isValidAccNum } from "../utils/checkDuplicate.js";

const router = express.Router();


// function to generate a token for the user verification
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}


// function to create an account number: datePart + randomPart
const generateAccountNumber = () => {
    const part1 = Date.now().toString().slice(-6);
    const part2 = Math.floor(100000 + Math.random() * 900000).toString();
    const accNumber = part1 + part2;

    return `${accNumber.slice(0, 4)}-${accNumber.slice(4, 8)}-${accNumber.slice(8, 12)}`;
}

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(500).json({ msg: "All fields are required" });
    }

    if (password.length < 8) return res.status(400).json({ msg: "Password must be atleast 8 characters in length!" });

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(500).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user
    const user = new User({ username: username, email: email, password: hashedPassword });
    await user.save();

    // Creating a unique bank account number
    let accountNumber = generateAccountNumber();
    while (await isValidAccNum(accountNumber)) {
        accountNumber = generateAccountNumber();
    }

    const account = new Account({ accountHolder: user._id, accountNumber: accountNumber });
    await account.save();

    res.status(201).json({ msg: "New user created successfully", user, account });
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