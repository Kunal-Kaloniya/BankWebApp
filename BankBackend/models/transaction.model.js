import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null,
    },
    fromAccountNumber: {
        type: String,
        default: null
    },
    toAccountNumber: {
        type: String,
        default: null
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