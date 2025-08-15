import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import prisma from "@/lib/db";

const secret = process.env.JWT_SECRET;


export async function POST(req: NextRequest) {

    const { username, password } = await req.json();
    const userDb = await prisma.user.findFirst({
        where: { username },
        include: {
            role: true
        }
    });

    console.log({ username, password });

    if (!userDb || !bcrypt.compareSync(password, userDb.password)) {
        return new Response(
            JSON.stringify({ message: "Invalid credentials" }),
            { status: 401 }
        );
    }


    if (!secret) {
        throw new Error("ok")
    }

    // buat token
    const token = jwt.sign({ username: userDb.username, role: userDb.role.role_name }, secret, { expiresIn: "1h" });

    // simpan di cookei
    const cookie = serialize("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60
    });



    return new Response(
        JSON.stringify({ message: "Login berhasil!", type: "success" }),
        {
            status: 200,
            headers: { "Set-Cookie": cookie },
        }
    );
}