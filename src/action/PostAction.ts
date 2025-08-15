"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

type FlashResponse = {
    success: boolean;
    message: string;
    type?: "success" | "error";
};
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