import { AuthUser } from "@/action/AuthUser";
import { NextResponse } from "next/server"

export async function GET(res: NextResponse) {
    const user = await AuthUser();
    console.log(user);

    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ message: "Authenticated", user });
}