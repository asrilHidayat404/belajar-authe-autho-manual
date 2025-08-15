"use client";
import { useFlash } from "@/context/FlashContext";
import axios from "axios";

export default function LogoutButton() {
    const { showFlash } = useFlash()
    const handleLogout = async () => {
        try {
            const res = await axios.post("/api/logout");
            const data = res.data
            showFlash({ message: data.message, type: "success" });

            // redirect ke halaman login
            setTimeout(() => window.location.href = "/login", 100);
        } catch (err) {
            console.error("Logout gagal", err);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
            Logout
        </button>
    );
}
