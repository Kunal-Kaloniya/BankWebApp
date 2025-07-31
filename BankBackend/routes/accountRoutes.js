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
    const { accountNumber, amount } = req.body;
    
    const intAmount = Number(amount);

    if (accountNumber.charAt(4) !== '-' && accountNumber.charAt(9) !== '-') {
        return res.status(400).json({ message: "Invalid Account Number" });
    }
    if (intAmount <= 0 || !intAmount) return res.status(400).json({ message: "Invalid amount." });

    try {
        const account = await Account.findOne({ accountNumber: accountNumber });

        if (!account) return res.status(404).json({ message: "Account Not Found!" });
        if (account.isFrozen) return res.status(500).json({ message: "Account is frozen!" });

        if (account.balance < intAmount) {
            await createTransaction(account._id, null, accountNumber, null, "withdraw", intAmount, "failed");
            return res.status(400).json({ message: "Insufficient Balance!" });
        }

        account.balance -= intAmount;
        await account.save();

        const newTransaction = await createTransaction(account._id, null, accountNumber, null, "withdraw", intAmount, "success");

        res.status(201).json({ message: "Amount successfully withdrawn", account, newTransaction });
    } catch (err) {
        await createTransaction(null, null, accountNumber, null, "withdraw", intAmount, "failed");
        res.status(500).json({ message: "Withdrawal failed!" });
    }
});

router.post('/deposit', async (req, res) => {
    const { accountNumber, amount } = req.body;

    const intAmount = Number(amount);

    if (accountNumber.charAt(4) !== '-' && accountNumber.charAt(9) !== '-') {
        return res.status(400).json({ message: "Invalid Account Number" });
    }
    if (intAmount <= 0 || !intAmount) return res.status(400).json({ message: "Invalid amount." });

    try {
        const account = await Account.findOne({ accountNumber: accountNumber });

        if (!account) return res.status(404).json({ message: "Account not found!" });
        if (account.isFrozen) return res.status(500).json({ message: "Account is frozen!" });

        account.balance += intAmount;
        await account.save();

        const newTransaction = await createTransaction(null, account._id, null, accountNumber, "deposit", intAmount, "success");

        res.status(201).json({ message: "Amount successfully deposited", account, newTransaction });
    } catch (err) {
        await createTransaction(null, null, null, accountNumber, "deposit", intAmount, "failed");
        res.status(500).json({ message: "Deposit failed!" });
    }
});

router.post('/transfer', async (req, res) => {
    const { senderAccNum, receiverAccNum, amount } = req.body;
    
    const intAmount = Number(amount);

    if ((senderAccNum.charAt(4) !== '-' && senderAccNum.charAt(9) !== '-') || (receiverAccNum.charAt(4) !== '-' && receiverAccNum.charAt(9) !== '-')) {
        return res.status(400).json({ message: "Invalid Account Number" });
    }

    if (intAmount <= 0) return res.status(500).json({ message: "Invalid amount!" });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sender = await Account.findOne({ accountNumber: senderAccNum }).session(session);
        const receiver = await Account.findOne({ accountNumber: receiverAccNum }).session(session);

        if (!sender || !receiver) throw new Error("Account not found!");
        if (sender.isFrozen) throw new Error("Your account is frozen!");
        if (receiver.isFrozen) throw new Error("Receicer's account is frozen!");
        if (sender.balance < intAmount) throw new Error("Insufficient Balance...");

        sender.balance -= intAmount;
        receiver.balance += intAmount;

        await sender.save({ session });
        await receiver.save({ session });

        await createTransaction(sender._id, receiver._id, senderAccNum, receiverAccNum, "transfer", intAmount, "success", session);

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