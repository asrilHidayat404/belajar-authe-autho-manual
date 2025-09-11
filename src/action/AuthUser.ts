"use server"
// action/AuthUser.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/db";

export async function AuthUser() {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (!payload || typeof payload.id !== "number") return null;
        const user = await prisma.user.findUnique({
            where: {
                id_user: payload.id
            },
            include: {
                role: true
            }
        })

        return user; // payload berisi { username, iat, exp }
    } catch (err) {
        return null;
    }
}
