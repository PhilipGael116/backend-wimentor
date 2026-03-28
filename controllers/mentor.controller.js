import { prisma } from "../config/db.js"

export const setupProfile = async (req, res) => {

    try {
        const { hasOlevel, oLevelSeries, hasAlevel, aLevelSeries, currentStatus, bio, location } = req.body;
        const userId = req.user.id;

        // check if the role is a mentor role
        if (req.user.role !== "Mentor") {
            return res.status(403).json({ message: "Only mentors can access this route" });
        }


        // check if the user already has a mentor profile
        const profileExists = await prisma.mentorProfile.findUnique({
            where: { userId }
        })

        if (profileExists) {
            return res.status(400).json({ message: "Mentor profile already exists" });
        }

        // create mentor profile

        const profile = await prisma.mentorProfile.create({
            data: {
                userId,
                hasOlevel,
                oLevelSeries,
                hasAlevel,
                aLevelSeries,
                currentStatus,
                bio,
                location
            }
        })

        return res.status(200).json({ status: "success", data: profile })
    } catch (error) {
        console.log(`Error setting up profile ${error.message}`);
        return res.status(500).json({ message: "Error creating the mentor profile" });
    }
}


export const followMentor = async (req, res) => {
    const { mentorUserId } = req.params;
    const menteeUserId = req.user.id;

    try {
        const update = await prisma.menteeProfile.update({
            where: { userId: menteeUserId },
            data: {
                mentors: {
                    connect: { userId: mentorUserId },
                }
            }
        })

        res.status(200).json({ message: "successfully followed mentor" })
    } catch (error) {
        console.log(`Error following mentor ${error.message}`);
        res.status(500).json({ message: "Error following mentor" })
    }
}


export const unFollowMentor = async (req, res) => {
    const { mentorUserId } = req.params;
    const menteeUserId = req.user.id;

    try {
        const update = await prisma.menteeProfile.update({
            where: { userId: menteeUserId },
            data: {
                mentors: {
                    disconnect: { userId: mentorUserId },
                }
            }
        })

        res.status(200).json({ message: "successfully unfollowed mentor" })
    } catch (error) {
        console.log(`Error unfollowing mentor ${error.message}`);
        res.status(500).json({ message: "Error unfollowing mentor" })
    }
}

export const getAllMentees = async (req, res) => {

    try {
        // make sure user is mentor
        if (req.user.role !== "Mentor") {
            return res.status(403).json({ message: "user must be a mentor" })
        }

        // find mentor and his mentees
        const mentor = await prisma.mentorProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                mentees: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!mentor) {
            return res.status(404).json({ message: "Mentor profile not found" })
        }

        return res.status(200).json({ status: "success", data: mentor.mentees })


    } catch (error) {
        console.log(`Error getting mentees ${error.message}`);
        res.status(500).json({ message: "Error getting mentees" })
    }


}

export const getAllReviews = async (req, res) => {
    try {
        // make sure user is mentor
        if (req.user.role !== "Mentor") {
            return res.status(403).json({ message: "user must be a mentor" })
        }

        const mentor = await prisma.mentorProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                reviews: {
                    include: {
                        author: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        if (!mentor) {
            return res.status(404).json({ message: "Mentor profile not found" })
        }

        return res.status(200).json({ status: "success", data: mentor.reviews })
    } catch (error) {
        console.log(`Error getting reviews: ${error.message}`);
        res.status(500).json({ message: "Error getting reviews" });
    }
}


export const getMentorReviews = async (req, res) => {
    try {
        const { mentorUserId } = req.params;

        // 1. Check if the mentor actually exists
        const mentor = await prisma.mentorProfile.findUnique({
            where: { userId: mentorUserId },
            include: {
                // 2. Bring in all their reviews
                reviews: {
                    include: {
                        author: { // Bring in the person who wrote the review
                            include: {
                                user: { // Get the author's First and Last Name
                                    select: {
                                        Fname: true,
                                        Lname: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc' // Show the newest reviews first!
                    }
                }
            }
        });

        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        // Return just the array of reviews
        res.status(200).json({ status: "success", data: mentor.reviews });

    } catch (error) {
        console.log(`Error getting mentor reviews: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
}
