import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    transactionType: {
        type: String,
        enum: ["withdraw", "deposit", "transfer"],
    },
    amount: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["success", "failed"],
    }
}, { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);