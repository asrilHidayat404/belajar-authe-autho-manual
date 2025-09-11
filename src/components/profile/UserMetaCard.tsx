"use client";

import { Camera, LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface User {
    avatar?: string;
    full_name?: string;
    nim?: string;
    role?: {
        role_name?: string;
    };
}

function UserMetaCard() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/authUser");
                if (!response.ok) throw new Error("Failed to fetch user data");
                const result = await response.json();
                setUser(result.user);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setIsLoading(false);
            }
        };

        getUser();
    }, []);

    const imgRef = useRef<HTMLInputElement>(null);
    const imgPreviewRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (imgPreviewRef.current && event.target?.result) {
                imgPreviewRef.current.style.backgroundImage = `url(${event.target.result})`;
                // Here you would typically update the user avatar in your backend
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement save logic here
        console.log("Saving changes...");
    };

    if (isLoading) return (
        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800 flex justify-center">
            <LoaderCircle className="animate-spin" />
        </div>
    );
    if (error) return <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800 text-red-500">Error: {error}</div>;

    return (
        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
            <form
                className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"
                encType="multipart/form-data"
                onSubmit={handleSave}
            >
                <div className="flex w-full flex-col items-center gap-6 xl:flex-row">
                    <div className="relative">
                        <div
                            ref={imgPreviewRef}
                            className="w-20 h-20 rounded-full bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: user?.avatar
                                    ? `url(${user.avatar})`
                                    : 'url("/avatar/profile.jpeg")'
                            }}
                        />
                        <input
                            type="file"
                            id="avatar"
                            ref={imgRef}
                            accept="image/*"
                            className="hidden"
                            name="avatar"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="avatar"
                            className="absolute right-0 bottom-0 flex items-center justify-center rounded-full border border-black bg-white p-1.5 text-black dark:border-white dark:bg-black dark:text-white cursor-pointer w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Change profile picture"
                        >
                            <Camera size={18} />
                        </label>
                    </div>

                    <div className="text-center xl:text-left">
                        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                            {user?.full_name || "No Name"}
                        </h4>
                        <div className="flex flex-col items-center gap-1 xl:flex-row xl:gap-3">
                            {user?.nim ? (
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">NIM</p>
                                    <div className="h-3.5 w-px bg-gray-300 dark:bg-gray-700" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.nim}</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                                    <div className="h-3.5 w-px bg-gray-300 dark:bg-gray-700" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {user?.role?.role_name || "No Role"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UserMetaCard;