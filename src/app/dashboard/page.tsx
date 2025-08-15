import { AuthUser } from "@/action/AuthUser";
import DeletePostButton from "@/components/DeletePostButton";
import LogoutButton from "@/components/LogoutButton";
import prisma from "@/lib/db";
import { User } from "@/types";
import { startTransition } from "react";

export default async function Dashboard() {
    const auth = (await AuthUser()) as User | null;

    // Ambil data user dari database
    const user = await prisma.user.findFirst({
        where: { username: auth?.username },
        include: { role: true },
    });

    if (!user) {
        throw new Error("User tidak ditemukan");
    }

    // Jika admin, ambil semua post. Jika bukan admin, ambil post user saja
    const posts = await prisma.post.findMany({
        where: user.role.role_name === "Admin" ? {} : { user_id: user.id_user },
        orderBy: { created_at: "desc" },
        include: { user: true }, // opsional: untuk menampilkan info pemilik post
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Selamat Datang, {user.username} 👋
                </h1>
                <p className="text-gray-600 mb-6">
                    Email: <span className="font-medium">{user.email ?? "-"}</span>
                </p>
                <p className="text-gray-600 mb-6">
                    Role: <span className="font-medium">{user.role.role_name ?? "-"}</span>
                </p>
                <p className="text-gray-600 mb-6">
                    Total Posts: <span className="font-medium">{posts.length}</span>
                </p>

                {/* Contoh menampilkan daftar post */}
                <div className="mt-6 text-left">
                    {posts.map((post) => (
                        <div key={post.id_post} className="border p-3 rounded mb-2">
                            <h2 className="font-semibold text-gray-700">{post.title}</h2>
                            <p className="text-gray-700">{post.content}</p>
                            <p className="text-sm text-gray-500">
                                {post.user.username} - {new Date(post.created_at).toLocaleString()}
                            </p>
                            {
                                user.role.role_name == "Admin" ? <DeletePostButton post_id={post.id_post} /> : null
                            }
                        </div>
                    ))}
                </div>

                <LogoutButton />
            </div>
        </div >
    );
}
