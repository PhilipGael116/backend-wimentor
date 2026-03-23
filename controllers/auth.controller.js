import { prisma } from "../config/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // check for empty fields
        if (!email || !password) {
            console.log("Error: All fields are required")
            return res.status(400).json({ message: "All fields are required" })
        }

        // check password length
        if (password.length < 8) {
            console.log("Error: Password must be 8 characters or more")
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }

        // Check if email is valid
        if (!emailRegex.test(email)) {
            console.log("Error: Invalid email format")
            return res.status(400).json({ message: "Invalid email format" })
        }

        // check if user exists already
        const user = await prisma.user.findUnique({
            where: { email: email }
        })

        if (!user) {
            console.log(`Login Failed: No user found with email ${email}`);
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // check if password matches
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            console.log(`Login Failed: Incorrect password for user ${email}`);
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15d" }
        )

        console.log("user logged in")
        res.status(200).json({ token, user })
    } catch (error) {
        console.error(`CRITICAL LOGIN ERROR: ${error.message}`);
        res.status(500).json({ message: "Login service is currently unavailable" })
    }
}


export const register = async (req, res) => {
    try {
        const { Fname, Lname, email, password, phone, role } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^6[5-9]\d{7}$/

        // check if all fields are filled
        if (!Fname || !Lname || !email || !password || !phone || !role) {
            console.log("Registration Error: Missing required fields in request body");
            return res.status(400).json({ message: "Please complete all fields" })
        }

        // Check if email is valid
        if (!emailRegex.test(email)) {
            console.log(`Registration Error: Invalid email format (${email})`);
            return res.status(400).json({ message: "Invalid email format" })
        }

        // check if phone number is valid
        if (!phoneRegex.test(phone)) {
            console.log(`Registration Error: Invalid phone number (${phone})`);
            return res.status(400).json({ message: "Invalid phone number" })
        }

        // check password length
        if (password.length < 8) {
            console.log(`Registration Error: Password too short for email ${email}`);
            return res.status(400).json({ message: "Password does not meet security requirements" })
        }

        // check if the user already exists
        const userExists = await prisma.user.findUnique({
            where: { email: email }
        })

        if (userExists) {
            console.log(`Registration Blocked: User already exists with email ${email}`);
            return res.status(409).json({ message: "An account with these details cannot be created" })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await prisma.user.create({
            data: {
                Fname,
                Lname,
                email,
                password: hashedPassword,
                phone,
                role,
                menteeProfile: role === "Mentee" ? {
                    create: {}
                } : undefined
            },
        })

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15d" }
        )

        res.status(201).json({
            status: "success",
            token,
            data: {
                Fname,
                Lname,
                email,
                phone,
                role
            }
        })
        console.log("user created")
    } catch (error) {
        console.error(`CRITICAL REGISTRATION ERROR: ${error.message}`);
        res.status(500).json({ message: "Registration service is currently unavailable" })
    }

}


export const logout = async (req, res) => {
    try {
        // This clears the cookie named "jwt" that we look for in the middleware
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0) // Expire it immediately (Jan 1st, 1970)
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(`Error during logout: ${error.message}`);
        res.status(500).json({ message: "Error logging out" });
    }
}



