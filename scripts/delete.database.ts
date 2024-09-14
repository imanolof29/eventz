import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function deleteDatabase() {
    await prisma.category.deleteMany()
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()
}