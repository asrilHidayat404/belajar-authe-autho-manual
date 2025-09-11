import { AuthUser } from "@/action/AuthUser";
import LogoutButton from "@/components/LogoutButton";
import DashboardLayout from "@/layouts/DashboardLayout";
import prisma from "@/lib/db";
import { User } from "@/types";
import { startTransition } from "react";

export default async function Dashboard() {
    const auth = (await AuthUser()) as User | null;

    // Ambil data user dari database
    const user = await prisma.user.findUnique({
        where: { email: auth?.email },
        include: { role: true },
    });

    if (!user) {
        throw new Error("User tidak ditemukan");
    }


    return (
        <DashboardLayout>
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className=" p-8 rounded-xl shadow-md w-full max-w-lg text-center">
                    <h1 className="text-3xl font-bold mb-4">
                        Selamat Datang, {user.full_name} 👋
                    </h1>
                    <p className=" mb-6">
                        Email: <span className="font-medium">{user.email ?? "-"}</span>
                    </p>
                    <p className=" mb-6">
                        Role: <span className="font-medium">{user.role.role_name ?? "-"}</span>
                    </p>



                    <LogoutButton />
                </div>
            </div >
        </DashboardLayout >
    );
}
