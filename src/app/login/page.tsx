"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useFlash } from "@/context/FlashContext";
import { useRouter } from "next/navigation";
import AuthLayout from "@/layouts/Auth-Layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    const router = useRouter()
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
                email,
                password,
            });

            const data = res.data;

            // tampilkan flash
            showFlash({ message: data.message, type: "success" });

            // redirect ke dashboard
            router.push("/dashboard");
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
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <div className="flex flex-1 flex-col">
                <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                    <div>
                        <img src="/logo/logo-ua.png" alt="" width={200} className="mx-auto lg:hidden mb-10 lg:mb-0" />
                        <div className="mb-5 sm:mb-8">
                            <h1 className="text-3xl mb-2 font-semibold">Sign In</h1>
                            <p className="text-sm ">Enter your email and password to sign in!</p>
                        </div>
                        <div>
                            <form onSubmit={handleLogin}>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>
                                            Email <span className="text-error-500">*</span>
                                        </Label>
                                        <Input placeholder="info@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>
                                            Password <span className="text-error-500">*</span>{' '}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"} // Toggle between text and password
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id="show-password"
                                                checked={showPassword}
                                                onCheckedChange={() => setShowPassword(!showPassword)}
                                            />
                                            <Label htmlFor="show-password" className="text-theme-sm block font-normal text-gray-700 dark:text-gray-400">
                                                Show password
                                            </Label>
                                        </div>
                                    </div>
                                    <div>
                                        <Button className="w-full" size="sm" disabled={loading ? true : false}>
                                            {
                                                loading && <LoaderCircle className="h-4 w-4 animate-spin" />
                                            }
                                            Sign in
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}