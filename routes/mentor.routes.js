import express from "express"
import { setupProfile, followMentor, unFollowMentor, getAllMentees, getMentorReviews } from "../controllers/mentor.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/setup", authMiddleware, setupProfile);
router.post("/follow/:mentorUserId", authMiddleware, followMentor);
router.post("/unfollow/:mentorUserId", authMiddleware, unFollowMentor);
router.get("/getAllMentees", authMiddleware, getAllMentees)
router.get("/getMentorReview/:mentorUserId", authMiddleware, getMentorReviews)


export default router;