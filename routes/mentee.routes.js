import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllMentors, getMentorById, myMentors, myReviews } from "../controllers/mentee.controller.js";

const router = express.Router();

router.get("/myReviews", authMiddleware, myReviews)
router.get("/mymentors", authMiddleware, myMentors)
router.get("/getAllMentors", authMiddleware, getAllMentors)
router.get("/getMentor/:mentorUserId", authMiddleware, getMentorById)

export default router