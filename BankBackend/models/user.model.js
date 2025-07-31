import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    accountNumber: {
        type: String,
        unique: true,
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);