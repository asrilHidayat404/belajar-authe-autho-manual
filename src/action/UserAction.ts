"use server"

import prisma from "@/lib/db"
import { AuthUser } from "./AuthUser"
import { revalidatePath } from "next/cache"
import { User } from "@/types"

export const store = async (formData: FormData) => {
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role_id = formData.get("role_id") as string

    const data = { username, email, password, role_id }
    console.log(data);

}

export const update = async (prevState: any, formData: FormData | Partial<User>) => {
    const user = await AuthUser()

    if (!user) {
        return { success: false, message: "User tidak ditemukan!", type: "error" }
    }

    try {
        const data = formData instanceof FormData ? {
            full_name: formData.get("full_name") as string,
            email: formData.get("email") as string,
            gender: formData.get("gender") as string,
            // tambahkan field lainnya sesuai kebutuhan
        } : formData;

        await prisma.user.update({
            where: { id_user: user.id_user },
            data: {
                full_name: data.full_name,
                email: data.email,
                gender: data.gender,
                ...(user.role.role_name === "Mahasiswa" && {
                    nim: data.nim,
                    faculty: data.faculty,
                    field_of_study: data.field_of_study,
                    semester: data.semester,
                    class: data.class
                })
            }
        })

        // Revalidasi multiple paths untuk memastikan cache diperbarui
        revalidatePath("/dashboard/profile")
        revalidatePath("/dashboard", "layout")

        return {
            success: true,
            message: "Profil berhasil diperbarui!",
            type: "success"
        }
    } catch (error) {
        console.error("Update error:", error)
        return {
            success: false,
            message: "Gagal memperbarui profil",
            type: "error"
        }
    }
}