import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import prisma from "@/lib/db";

const secret = process.env.JWT_SECRET;


export async function POST(req: NextRequest) {

    const { email, password } = await req.json();
    const userDb = await prisma.user.findUnique({
        where: {
            email
        },
        include: {
            role: true
        }
    });




    if (!userDb || !userDb.password || !bcrypt.compareSync(password, userDb.password)) {
        return new Response(
            JSON.stringify({ message: "Invalid credentials" }),
            { status: 401 }
        );
    }


    if (!secret) {
        throw new Error("ok")
    }

    // buat token
    const token = jwt.sign({ id: userDb.id_user, email: userDb.email, role: userDb?.role?.role_name }, secret, { expiresIn: "1h" });

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