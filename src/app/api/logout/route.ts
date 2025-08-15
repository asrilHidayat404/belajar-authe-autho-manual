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
    const flashCookie = serialize("flash", JSON.stringify({ message: "Logout berhasil!", type: "success" }), {
        path: "/",
        maxAge: 5, // hanya 5 detik
    });
    const headers = new Headers();
    headers.append("Set-Cookie", cookie);
    headers.append("Set-Cookie", flashCookie);

    return NextResponse.json({ message: "Logout success" }, {
        status: 200,
        headers
    });
}
