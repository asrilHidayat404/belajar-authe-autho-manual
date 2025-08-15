// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useFlash } from "@/context/FlashContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { showFlash } = useFlash()



    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = "/dashboard";
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post("/api/login", {
                username,
                password,
            });

            const data = res.data;

            // tampilkan flash
            showFlash({ message: data.message, type: "success" });

            // redirect ke dashboard
            setTimeout(() => window.location.href = "/dashboard", 100);

        } catch (err: any) {
            // jika login gagal
            const message = err.response?.data?.message || "Login gagal, periksa kredensial.";
            setError(message);
            showFlash({ message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Selamat Datang 👋
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <p className="text-xs text-gray-500 mt-6 text-center">
                    &copy; {new Date().getFullYear()} Sistem Anda. All rights reserved.
                </p>
            </div>
        </div>
    );
}
