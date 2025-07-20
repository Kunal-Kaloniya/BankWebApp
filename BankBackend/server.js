import express from "express";
import "dotenv/config";

import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

connectDB()
    .then(() => {

        app.use('/', authRoutes);

        app.get('/', (req, res) => {
            res.send({ msg: "Server is running!" });
        })

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })
    })
    .catch((err) => {
        console.error("Unable to connect to the database: ", err);
    })