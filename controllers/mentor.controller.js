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