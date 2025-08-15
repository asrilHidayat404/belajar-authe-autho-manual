// components/FlashMessage.tsx
"use client";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useFlashMessage } from "@/hooks/useFlashMessage";

export const FlashMessage = () => {
    const flash = useFlashMessage();

    useEffect(() => {
        if (!flash) return;

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: flash.type,
            title: flash.message,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
        });
    }, [flash?.key]);

    return null;
};
