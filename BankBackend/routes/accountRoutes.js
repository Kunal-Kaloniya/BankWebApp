import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { Account } from "../models/account.model.js";
import { Transaction } from "../models/transaction.model.js";

const router = express.Router();
router.use(verifyToken);

const createTransaction = async (id, type, amount, status) => {
    try {
        const transaction = new Transaction({
            accountId: id,
            transactionType: type,
            amount: amount,
            status: status,
        });
        await transaction.save();

        return transaction;
    } catch (err) {
        console.error("Error creating transaction!");
        return null;
    }
}

router.get('/', async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json({ msg: "Unable to get the accounts" });
    }
});

router.get('/:userId', async (req, res) => {

    const { userId } = req.params;

    try {
        const account = await Account.findOne({ accountHolder: userId });
        res.status(200).json(account);
    } catch (err) {
        res.status(404).json({ msg: "Account Not Found" });
    }
});

router.get('/transactions/:accountId', async (req, res) => {
    const { accountId } = req.params;

    try {
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Account not found!" });
        }

        const transactions = await Transaction.find({ accountId: accountId });
        if (!transactions) {
            return res.status(500).json({ msg: "No Transactions." });
        }

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ msg: "Error getting all the transactins" });
    }
})

router.post('/withdraw', async (req, res) => {
    const { accountId, amount } = req.body;

    if (amount <= 0 || !amount) {
        return res.status(400).json({ msg: "Invalid amount." });
    }

    try {
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Account Not Found!" });
        }

        if (account.balance < amount) {
            await createTransaction(accountId, "withdraw", amount, "failed");
            return res.status(400).json({ msg: "Insufficient Balance!" });
        }

        account.balance -= amount;
        await account.save();

        const newTransaction = await createTransaction(accountId, "withdraw", amount, "success");

        res.status(201).json({ msg: "Amount successfully withdrawn", account, newTransaction });
    } catch (err) {
        await createTransaction(accountId, "withdraw", amount, "failed");
        res.status(500).json({ msg: "Withdrawal failed!" });
    }
});

router.post('/deposit', async (req, res) => {
    const { accountId, amount } = req.body;

    if (amount <= 0 || !amount) {
        return res.status(400).json({ msg: "Invalid amount." });
    }

    try {
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Account not found!" });
        }

        account.balance += amount;
        await account.save();

        const newTransaction = await createTransaction(accountId, "deposit", amount, "success");

        res.status(201).json({ msg: "Amount successfully deposited", account, newTransaction });
    } catch (err) {
        await createTransaction(accountId, "deposit", amount, "failed");
        res.status(500).json({ msg: "Deposit failed!" });
    }
});

export default router;