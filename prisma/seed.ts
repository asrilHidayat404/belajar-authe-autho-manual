const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../src/generated/prisma"); // path relatif
const prisma = new PrismaClient();

async function main() {
    // ===== 1. Seed Roles =====
    const roles = ["Admin", "Reviewer", "Keuangan", "Mahasiswa"];
    for (const role_name of roles) {
        await prisma.role.upsert({
            where: { role_name },
            update: {},
            create: { role_name },
        });
    }
    console.log("Roles seeded!");

    // ===== 2. Seed Users =====
    const users = [
        { full_name: "Admin", email: "admin@gmail.com", role_name: "Admin" },
        { full_name: "Sephoni", email: "sephoni@gmail.com", role_name: "Reviewer" },
        { full_name: "Cate", email: "cate@gmail.com", role_name: "Keuangan" },
        { full_name: "Alice", email: "alice@gmail.com", role_name: "Mahasiswa" },
    ];

    for (const u of users) {
        const role = await prisma.role.findUnique({ where: { role_name: u.role_name } });
        if (!role) throw new Error(`Role ${u.role_name} not found`);

        const hashedPassword = await bcrypt.hash("password", 10);

        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                full_name: u.full_name,
                email: u.email,
                password: hashedPassword,
                role_id: role.id_role,
            },
        });
    }
    console.log("Users seeded!");

}

// ===== Run Seeder =====
main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
