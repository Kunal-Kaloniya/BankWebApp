import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { Account } from "../models/account.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

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

    if (!mongoose.Types.ObjectId.isValid(accountId)) return res.status(400).json({ msg: "Invalid Id" });

    try {
        const account = await Account.findById(accountId);

        if (!account) return res.status(404).json({ msg: "Account Not Found!" });
        if (account.isFrozen) return res.status(500).json({ msg: "Account already frozen!" });

        account.isFrozen = true;
        await account.save();

        res.status(200).json({ msg: "Account successfully frozen" });
    } catch (err) {
        res.status(500).json({ msg: "Unable to freeze the account!" });
    }
});

router.put('/unfreeze/:accountId', async (req, res) => {
    const { accountId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accountId)) return res.status(400).json({ msg: "Invalid Id" });

    try {
        const account = await Account.findById(accountId);

        if (!account) return res.status(404).json({ msg: "Account Not Found!" });
        if (!account.isFrozen) return res.status(500).json({ msg: "Account is already unforzen!" });

        account.isFrozen = false;
        await account.save();

        res.status(200).json({ msg: "Account successfully unfrozen!" });
    } catch (err) {
        res.status(500).json({ msg: "Unable to unfreeze the account!" });
    }
})

export default router;