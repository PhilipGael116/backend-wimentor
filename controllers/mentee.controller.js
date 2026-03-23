import { prisma } from "../config/db.js"

export const myReviews = async (req, res) => {
    try {
        //  check role to make sure it is mentee

        if (req.user.role !== "Mentee") {
            return res.status(403).json({ message: "You must be a mentee to access" })
        }

        const mentee = await prisma.menteeProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                reviews: {
                    include: {
                        mentor: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        })

        if (!mentee) {
            return res.status(404).json({ message: "Mentee profile not found" })
        }

        return res.status(200).json({ status: "success", data: mentee.reviews })
    } catch (error) {
        console.log(`Error getting reviews: ${error.message}`);
        res.status(500).json({ message: "Error getting reviews" });
    }
}

export const myMentors = async (req, res) => {
    try {
        //  check role to make sure it is mentee

        if (req.user.role !== "Mentee") {
            return res.status(403).json({ message: "You must be a mentee to access" })
        }

        const mentee = await prisma.menteeProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                mentors: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (!mentee) {
            return res.status(404).json({ message: "Mentee profile not found" })
        }

        return res.status(200).json({ status: "success", data: mentee.mentors })
    } catch (error) {
        console.log(`Error getting mentors: ${error.message}`);
        res.status(500).json({ message: "Error getting mentors" });
    }
}


export const getAllMentors = async (req, res) => {
    try {
        // 1. Find EVERY profile in the Mentor table
        const mentors = await prisma.mentorProfile.findMany({
            include: {
                user: { // Bring their name and email along
                    select: {
                        Fname: true,
                        Lname: true,
                    }
                },
                _count: {
                    select: {
                        mentees: true // Just gives you the "number" of students
                    }
                }
            }
        });

        // 2. Return the list
        res.status(200).json({ status: "success", data: mentors });

    } catch (error) {
        console.log(`Error getting mentors: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getMentorById = async (req, res) => {
    try {
        const { mentorUserId } = req.params;

        // 1. Find the specific Mentor
        const mentor = await prisma.mentorProfile.findUnique({
            where: { userId: mentorUserId }, // Use the ID from the URL
            include: {
                user: {
                    select: {
                        Fname: true,
                        Lname: true,
                        email: true,
                        phone: true
                    }
                },
                // 2. Also bring their reviews so the Mentee can see feedback!
                reviews: {
                    include: {
                        author: { // To show who wrote each review
                            include: { user: true }
                        }
                    }
                },
                // 3. And show how many students they have!
                _count: {
                    select: { mentees: true }
                }
            }
        });

        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        res.status(200).json({ status: "success", data: mentor });

    } catch (error) {
        console.log(`Error getting mentor: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
}
