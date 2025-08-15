import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@/generated/prisma";

const prisma = new PrismaClient();

const userData: Omit<Prisma.UserCreateInput, "password">[] = [
    {
        username: "Alice",
        email: "alice@prisma.io",
    },
];

async function main() {
    for (const u of userData) {
        const hashedPassword = await bcrypt.hash("password", 10);
        await prisma.user.create({
            data: {
                ...u,
                password: hashedPassword,
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
