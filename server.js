import express from "express"
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import mentorRoutes from "./routes/mentor.routes.js"

config()


const app = express();

const PORT = process.env.PORT || 5001

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes)
app.use("/api", mentorRoutes)

connectDB();

app.listen(PORT, () => {
    console.log("Server running on port ", PORT);
})