// app/dashboard/page.tsx
import { AuthUser } from "@/action/AuthUser";
import LogoutButton from "@/components/LogoutButton";
import prisma from "@/lib/db";
import { User } from "@/types";

export default async function Dashboard() {
    const auth = (await AuthUser()) as User | null;

    if (!auth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-xl font-semibold text-red-600">
                    Harus login dulu
                </h1>
            </div>
        );
    }

    // Ambil data user dari database
    const user = await prisma.user.findFirst({
        where: { username: auth.username },
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Selamat Datang, {user?.username} 👋
                </h1>
                <p className="text-gray-600 mb-6">
                    Email: <span className="font-medium">{user?.email ?? "-"}</span>
                </p>
                <p className="text-gray-600 mb-6">
                    Email: <span className="font-medium">{user?.email ?? "-"}</span>
                </p>
                <LogoutButton />
            </div>
        </div>
    );
}
