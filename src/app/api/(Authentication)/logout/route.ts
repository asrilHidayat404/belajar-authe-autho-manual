import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
    const cookie = serialize("token", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 0, // langsung hapus cookie
    });

    return new Response(
        JSON.stringify({ message: "Logout berhasil!", type: "success" }),
        {
            status: 200,
            headers: { "Set-Cookie": cookie },
        }
    );
}
