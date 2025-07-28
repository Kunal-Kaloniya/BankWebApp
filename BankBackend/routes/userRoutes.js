import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { User } from "../models/user.model.js"
import { Account } from "../models/account.model.js";

const router = express.Router();

router.get('/verify-token', verifyToken, (req, res) => {
    res.status(200).json({
        message: "Token is valid",
        user: req.user
    })
})

router.get('/', async (req, res) => {
    try {
        const accounts = await User.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: "Unable to get the users" });
    }
});

router.get('/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id });
        res.json(user);
    } catch (err) {
        res.status(404).json({ message: "User Not Found" });
    }
});

export default router;