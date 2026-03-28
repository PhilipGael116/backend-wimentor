import express from "express"
import cors from "cors"
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import mentorRoutes from "./routes/mentor.routes.js"
import reviewRoutes from "./routes/review.routes.js"
import menteeRoutes from "./routes/mentee.routes.js"

config()


const app = express();

const PORT = process.env.PORT || 5001

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use(cors({
    origin: ["http://localhost:5173", "https://mentorat-zeta.vercel.app"],
    credentials: true
}));

// routes
app.use("/api/auth", authRoutes)
app.use("/api", mentorRoutes)
app.use("/api", reviewRoutes)
app.use("/api", menteeRoutes)

connectDB();

app.get("/", (req, res) => {
    res.send(`Backend is live on port ${PORT}`);
})

app.listen(PORT, () => {
    console.log("Server running on port ", PORT);
})