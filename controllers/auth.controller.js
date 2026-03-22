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
            console.log("error: user does not exist")
            res.status(404).json({ message: "Invalid credentials" })
        }

        // check if password matches
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            console.log("error: Invalid Credentials")
            res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15d" }
        )

        console.log("user logged in")
        res.status(200).json({ token, user })
    } catch (error) {
        console.log(`Error during registration ${error.message}`);
        res.status(500).json({ message: "Error creating user" })
    }
}


export const register = async (req, res) => {
    try {
        const { Fname, Lname, email, password, phone, role } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^6[5-9]\d{7}$/

        // check if all fields are filled
        if (!Fname || !Lname || !email || !password || !phone) {
            console.log("Error: All fields are required")
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check if email is valid
        if (!emailRegex.test(email)) {
            console.log("Error: Invalid email format")
            return res.status(400).json({ message: "Invalid email format" })
        }

        // check if phone number is valid
        if (!phoneRegex.test(phone)) {
            console.log("Error: Invalid phone number")
            return res.status(400).json({ message: "Invalid phone number" })
        }

        // check password length
        if (password.length < 8) {
            console.log("Error: Password must be 8 characters or more")
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }

        // check if the user already exists
        const userExists = await prisma.user.findUnique({
            where: { email: email }
        })

        if (userExists) {
            console.log("Error: Email already exists")
            return res.status(400).json({ message: "Invalid Credentials" })

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
        console.log(`Error during registration ${error.message}`);
        res.status(500).json({ message: "Error creating user" })
    }

}



