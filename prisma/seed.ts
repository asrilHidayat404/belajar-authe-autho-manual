const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../src/generated/prisma"); // path relatif
const prisma = new PrismaClient();

async function main() {
    // ===== 1. Seed Roles =====
    const roles = ["Admin", "Mahasiswa"];
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
        { username: "Alice", email: "alice@gmail.com", role_name: "Mahasiswa" },
        { username: "Admin", email: "admin@gmail.com", role_name: "Admin" },
    ];

    for (const u of users) {
        const role = await prisma.role.findUnique({ where: { role_name: u.role_name } });
        if (!role) throw new Error(`Role ${u.role_name} not found`);

        const hashedPassword = await bcrypt.hash("password", 10);

        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                username: u.username,
                email: u.email,
                password: hashedPassword,
                role_id: role.id_role,
            },
        });
    }
    console.log("Users seeded!");

    // ===== 3. Seed Posts =====
    const posts = [
        { title: "Post 1", content: "Konten Post 1", user_email: "alice@gmail.com" },
        { title: "Post 2", content: "Konten Post 2", user_email: "admin@gmail.com" },
    ];

    for (const p of posts) {
        const user = await prisma.user.findUnique({ where: { email: p.user_email } });
        if (!user) throw new Error(`User ${p.user_email} not found`);

        await prisma.post.upsert({
            where: { title: p.title },
            update: {},
            create: {
                title: p.title,
                content: p.content,
                user_id: user.id_user,
            },
        });
    }
    console.log("Posts seeded!");
}

// ===== Run Seeder =====
main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
