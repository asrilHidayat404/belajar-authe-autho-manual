import prisma from "@/lib/db";
import { AuthUser } from "@/action/AuthUser";
import { User } from "@/types";

export default async function Posts() {
    const posts = await getPosts();
    const auth = (await AuthUser()) as User | null;
    if (!auth) return [];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard {auth.username}</h1>
            {posts.length === 0 ? (
                <p>Belum ada post.</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id_post} className="mb-2 border-b pb-2">
                            <p className="font-semibold">{post.title}</p>
                            <p className="text-sm text-gray-600">Oleh: {post.user.username}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


// action/PostAction.ts

async function getPosts() {
    // ambil user yang sedang login
    const auth = (await AuthUser()) as User | null;
    if (!auth) return [];

    // ambil data user beserta role
    const user = await prisma.user.findFirst({
        where: { username: auth.username },
        include: { role: true },
    });

    if (!user) return [];

    let posts;
    if (user.role.role_name === "Admin") {
        // admin bisa lihat semua post
        posts = await prisma.post.findMany({
            orderBy: { created_at: "desc" },
            include: { user: true }, // sertakan info user
        });
    } else {
        // user biasa hanya bisa lihat post sendiri
        posts = await prisma.post.findMany({
            where: { user_id: user.id_user },
            orderBy: { created_at: "desc" },
            include: { user: true },
        });
    }

    return posts;
}
