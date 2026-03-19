import express from "express"
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"

config()


const app = express();

const PORT = process.env.PORT || 5001

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRoutes)

connectDB();

app.listen(PORT, () => {
    console.log("Server running on port ", PORT);
})