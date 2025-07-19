import express from "express";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected || DB Host: ", connectionInstance.connection.host);
    } catch (err) {
        console.error("MongoDB connection error: ", err);
        process.exit(1);
    }
}

export default connectDB;