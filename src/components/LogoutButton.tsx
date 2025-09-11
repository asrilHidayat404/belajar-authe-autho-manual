"use client";
import { useFlash } from "@/context/FlashContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

export default function LogoutButton() {
    const { showFlash } = useFlash()
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const res = await axios.post("/api/logout");
            const data = res.data
            showFlash({ message: data.message, type: "success" });

            // redirect ke halaman login
            router.push("/login")
        } catch (err) {
            console.error("Logout gagal", err);
        }
    };

    return (
        <Link href="#"
            onClick={handleLogout}
        >
            Logout
        </Link>
    );
}
