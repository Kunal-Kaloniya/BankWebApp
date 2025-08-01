import express from "express";
import "dotenv/config";
import cors from "cors";
// import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "Too many attempts. Try again later!",
});

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
// app.use(mongoSanitize());

connectDB()
    .then(() => {

        app.use('/auth', authLimiter, authRoutes);
        app.use('/users', userRoutes);
        app.use('/accounts', accountRoutes);
        app.use('/admin', adminRoutes);

        app.get('/', (req, res) => {
            res.send({ message: "Server is running!" });
        })

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })
    })
    .catch((err) => {
        console.error("Unable to connect to the database: ", err);
    })