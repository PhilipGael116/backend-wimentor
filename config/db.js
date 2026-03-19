import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log("Database connected to prisma")
    } catch (error) {
        console.error(`Failed to connect to DB ${error.message}`)
    }
}

export { prisma, connectDB }