import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { Account } from "../models/account.model.js";
import { Transaction } from "../models/transaction.model.js";
import mongoose from "mongoose";

const router = express.Router();
router.use(verifyToken);

const createTransaction = async (from, to, fromAccNum, toAccNum, type, amount, status, session = null) => {
    try {
        const transaction = new Transaction({
            from,
            to,
            fromAccountNumber: fromAccNum,
            toAccountNumber: toAccNum,
            transactionType: type,
            amount,
            status,
        });
        await transaction.save(session ? { session } : {});

        return transaction;
    } catch (err) {
        console.error("Error creating transaction!");
        return null;
    }
}

// basic routes to get the account details
router.get('/:userId', async (req, res) => {

    const { userId } = req.params;

    try {
        const account = await Account.findOne({ accountHolder: userId });
        res.status(200).json(account);
    } catch (err) {
        res.status(404).json({ message: "Account Not Found" });
    }
});

router.get('/transactions/:accountId', async (req, res) => {
    const { accountId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accountId)) return res.status(400).json({ message: "Invalid Id" });

    try {
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ message: "Account not found!" });
        }

        const transactions = await Transaction.find({ $or: [{ from: accountId }, { to: accountId }] });
        if (!transactions) {
            return res.status(500).json({ message: "No withdrawls found." });
        }

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Error getting all the transactins" });
    }
});


// Routes for transactions
router.post('/withdraw', async (req, res) => {
    const { accountId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(accountId)) return res.status(400).json({ message: "Invalid Id" });
    if (amount <= 0 || !amount) return res.status(400).json({ message: "Invalid amount." });

    try {
        const account = await Account.findById(accountId);

        if (!account) return res.status(404).json({ message: "Account Not Found!" });
        if (account.isFrozen) return res.status(500).json({ message: "Account is frozen!" });

        if (account.balance < amount) {
            await createTransaction(accountId, null, account.accountNumber, null, "withdraw", amount, "failed");
            return res.status(400).json({ message: "Insufficient Balance!" });
        }

        account.balance -= amount;
        await account.save();

        const newTransaction = await createTransaction(accountId, null, account.accountNumber, null, "withdraw", amount, "success");

        res.status(201).json({ message: "Amount successfully withdrawn", account, newTransaction });
    } catch (err) {
        await createTransaction(accountId, null, null, null, "withdraw", amount, "failed");
        res.status(500).json({ message: "Withdrawal failed!" });
    }
});

router.post('/deposit', async (req, res) => {
    const { accountId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(accountId)) return res.status(400).json({ message: "Invalid Id" });
    if (amount <= 0 || !amount) return res.status(400).json({ message: "Invalid amount." });

    try {
        const account = await Account.findById(accountId);

        if (!account) return res.status(404).json({ message: "Account not found!" });
        if (account.isFrozen) return res.status(500).json({ message: "Account is frozen!" });

        account.balance += amount;
        await account.save();

        const newTransaction = await createTransaction(null, accountId, null, account.accountNumber, "deposit", amount, "success");

        res.status(201).json({ message: "Amount successfully deposited", account, newTransaction });
    } catch (err) {
        await createTransaction(null, accountId, null, null, "deposit", amount, "failed");
        res.status(500).json({ message: "Deposit failed!" });
    }
});

router.post('/transfer', async (req, res) => {
    const { senderId, receiverId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: "Invalid Id" });
    }
    
    if (amount <= 0) return res.status(500).json({ message: "Invalid amount!" });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sender = await Account.findById(senderId).session(session);
        const receiver = await Account.findById(receiverId).session(session);

        if (!sender || !receiver) throw new Error("Account not found!");
        if (sender.isFrozen) throw new Error("Your account is frozen!");
        if (receiver.isFrozen) throw new Error("Receicer's account is frozen!");
        if (sender.balance < amount) throw new Error("Insufficient Balance...");

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save({ session });
        await receiver.save({ session });

        await createTransaction(senderId, receiverId, sender.accountNumber, receiver.accountNumber, "transfer", amount, "success", session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Transfer successfull!" });

    } catch (err) {
        await session.abortTransaction();
        session.endSession()
        res.status(500).json({ message: "Transfer failed", error: err.message });
    }
});

export default router;