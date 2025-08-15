"use client";
import axios from "axios";

export default function LogoutButton() {
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");

            window.location.href = "/login"; // redirect ke halaman login
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
