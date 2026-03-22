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
                mentees: true
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