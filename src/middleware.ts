// import { jwtVerify } from "jose";
// import { NextRequest, NextResponse } from "next/server";
// import { AuthUser } from "./action/AuthUser";

// export async function middleware(req: NextRequest) {
//     const token = req.cookies.get("token")?.value;
//     const pathname = req.nextUrl.pathname;


//     // Sudah login, jangan bisa akses /login
//     if (pathname === "/login" && token) {
//         return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     // Halaman protected
//     if (pathname.startsWith("/dashboard") && !token) {
//         return NextResponse.redirect(new URL("/login", req.url));
//     }
//     if (pathname.startsWith("/dashboard/users")) {
//         if (!token) return NextResponse.redirect(new URL("/login", req.url));
//         const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//         const { payload } = await jwtVerify(token, secret);
//         if (!payload || typeof payload.username !== "string") return null;
//         if (payload.role !== "Admin") {
//             return NextResponse.redirect(new URL("/not-found", req.url));
//         }
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/login", "/dashboard/:path*"],
// };


import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { routeRoles } from "./routes/routes";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    // if (pathname === "/") {
    //     return NextResponse.redirect(new URL("/login", req.url));
    // }
    // Redirect ke dashboard kalau sudah login
    if (pathname === "/login" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Cek halaman yang membutuhkan login
    const protectedRoute = Object.keys(routeRoles).some(route => pathname.startsWith(route));
    if (protectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token) {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        console.log(payload);


        if (!payload || typeof payload.email !== "string" || !payload.role) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Cek role untuk route yang punya aturan
        for (const [route, roles] of Object.entries(routeRoles)) {
            if (
                pathname.startsWith(route) &&
                (typeof payload.role !== "string" || !roles.includes(payload.role))
            ) {
                // redirect ke 404 jika role tidak sesuai
                return NextResponse.rewrite(new URL("/not-found", req.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/dashboard/:path*"],
};



