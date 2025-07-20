import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    accountHolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    accountNumber: {
        type: Number,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export const Account = mongoose.model("Account", accountSchema);