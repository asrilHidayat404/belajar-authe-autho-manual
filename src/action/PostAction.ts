"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation";
import { AuthUser } from "./AuthUser";
import { User } from "@/types";

type FlashResponse = {
    success: boolean;
    message: string;
    type?: "success" | "error";
};

export async function store(formData: FormData): Promise<FlashResponse> {
    const auth = (await AuthUser()) as User | null;
    if (!auth) return { success: false, message: "User belum login", type: "error" };

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const user = await prisma.user.findFirst({ where: { username: auth.username } });
    if (!user) return { success: false, message: "User tidak ditemukan", type: "error" };

    try {
        await prisma.post.create({ data: { title, content, user_id: user.id_user } });

        // Redirect setelah berhasil
        return { success: true, message: "Post berhasil dibuat!", type: "success" };
    } catch (error) {
        return { success: false, message: "Gagal membuat post!", type: "error" };
    }
}

export async function destroy(id: number): Promise<FlashResponse> {
    try {
        await prisma.post.delete({
            where: {
                id_post: id
            }
        })
        revalidatePath("/dashboard");
        return { success: true, message: "Post berhasil dihapus!", type: "success" };
    } catch (error) {
        return { success: false, message: "Gagal menghapus post!", type: "error" };
    }
}