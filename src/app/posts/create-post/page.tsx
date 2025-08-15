"use client"; // karena ada interaksi form

import { store } from "@/action/PostAction";
import { useFlash } from "@/context/FlashContext";
import { redirect, useRouter } from "next/navigation";

export default function CreatePost() {
    const { showFlash } = useFlash()
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const result = await store(formData);
            showFlash({
                message: result.message,
                type: result.success ? "success" : "error",
            });
            if (result.success) {
                form.reset();
                router.push("/posts")
            }

        } catch (err) {
            console.error(err);
            showFlash({ message: "Terjadi kesalahan!", type: "error" });
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-black shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Buat Post Baru</h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label htmlFor="title" className="block font-medium mb-1">
                        Judul
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Masukkan judul post"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block font-medium mb-1">
                        Konten
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Tulis konten post..."
                        className="w-full border border-gray-300 rounded px-3 py-2 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Buat Post
                </button>
            </form>
        </div >
    );
}
