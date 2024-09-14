import { PrismaClient } from "@prisma/client"
import { passwordHash } from "src/utils/password.utility"

const prisma = new PrismaClient()

async function baseDatase() {

    const hashedPassword = await passwordHash.cryptPassword(
        'Password_123%'
    )

    await prisma.user
        .create({
            data: {
                email: 'imanolof29@gmail.com',
                password: hashedPassword,
                firstName: 'Imanol',
                lastName: 'Ortiz',
                username: 'imanolortiz'
            }
        })
}

baseDatase()