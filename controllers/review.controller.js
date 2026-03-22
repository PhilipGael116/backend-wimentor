import { prisma } from "../config/db.js"

export const createReview = async (req, res) => {
    try {
        const { mentorUserId, rating, comment } = req.body

        // checking the current role of the user

        if (req.user.role !== "Mentee") {
            return res.status(403).json({ message: "User must be a mentee" })
        }

        // get both the mentor and mentee profile

        const menteeProfile = await prisma.menteeProfile.findUnique({
            where: { userId: req.user.id }
        })

        const mentorProfile = await prisma.mentorProfile.findUnique({
            where: { userId: mentorUserId }
        })

        if (!mentorProfile) {
            return res.status(404).json({ message: "no mentor profile found" })
        }

        //  create the review

        const review = await prisma.review.create({
            data: {
                authorId: menteeProfile.id,
                mentorId: mentorProfile.id,
                comment: comment,
                rating: parseInt(rating)
            }
        })

        // calculate av. ratign for mentor
        const allReviews = await prisma.review.findMany({ where: { mentorId: mentorProfile.id } });
        const newAvRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;
        await prisma.mentorProfile.update({
            where: { id: mentorProfile.id },
            data: { avRating: newAvRating }
        });
        res.status(201).json({ status: "success", data: review });
    } catch (error) {
        console.log(`error creating review ${error.message}`);
        return res.status(500).json({ message: "Error creating the review" })
    }

}
