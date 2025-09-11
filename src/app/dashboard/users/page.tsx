import { AuthUser } from "@/action/AuthUser";
import DashboardLayout from "@/layouts/DashboardLayout";
import prisma from "@/lib/db";
import { User } from "@/types";

export default async function Users() {
    const authUser: User | null = await AuthUser();

    // if (authUser?.role?.role_name !== "Admin") {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <h1 className="text-2xl font-bold text-red-500">Unauthorized</h1>
    //         </div>
    //     );
    // }

    const users = await prisma.user.findMany({
        include: {
            role: true,
        },
    });

    return (
        <DashboardLayout>
            <main className="p-8">
                <h1 className="text-3xl font-semibold mb-6">Daftar Users</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                        <thead className="">
                            <tr>
                                <th className="py-2 px-4 border-b text-left">No</th>
                                <th className="py-2 px-4 border-b text-left">Username</th>
                                <th className="py-2 px-4 border-b text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, i) => (
                                <tr
                                    key={user.id_user}
                                    className="hover:bg-gray-900 transition-colors"
                                >
                                    <td className="py-2 px-4 border-b">{i + 1}</td>
                                    <td className="py-2 px-4 border-b">{user.username}</td>
                                    <td className="py-2 px-4 border-b">{user.role.role_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </DashboardLayout>
    );
}
