import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { verifyAdmin } from "../middleware/authMiddleware";
import { Account } from "../models/account.model";
import { User } from "../models/user.model.js";

const router = express.Router();
router.use(verifyToken, verifyAdmin);

router.get('/users', async (req, res) => {
    try {
        const accounts = await User.find();
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json({ msg: "Unable to get the accounts" });
    }
});

router.get('/accounts', async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json({ msg: "Unable to get the accounts" });
    }
});

router.put('/freeze/:accountId', async (req, res) => {
    const { accountId } = req.params;

    try {
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Account Not Found!" });
        }

        await Account.findByIdAndUpdate(accountId, { isFrozen: true });
        res.status(200).json({ msg: "Account successfully frozen" });
        
    } catch (err) {
        res.status(500).json({ msg: "Unable to freeze the account!" });
    }
})

export default router;