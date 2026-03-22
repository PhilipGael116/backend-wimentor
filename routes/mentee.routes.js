import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllMentors, myMentors, myReviews } from "../controllers/mentee.controller.js";

const router = express.Router();

router.get("/myReviews", authMiddleware, myReviews)
router.get("/mymentors", authMiddleware, myMentors)
router.get("/getAllMentors", authMiddleware, getAllMentors)

export default router