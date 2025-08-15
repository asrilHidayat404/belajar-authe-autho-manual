// context/FlashContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Swal from "sweetalert2";

interface FlashMessage {
    message: string;
    type: "success" | "error" | "info";
}

interface FlashContextType {
    showFlash: (msg: FlashMessage) => void;
}

const FlashContext = createContext<FlashContextType | undefined>(undefined);

export const FlashProvider = ({ children }: { children: ReactNode }) => {
    const showFlash = ({ message, type }: FlashMessage) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
        });
    };

    return (
        <FlashContext.Provider value={{ showFlash }}>
            {children}
        </FlashContext.Provider>
    );
};

export const useFlash = () => {
    const context = useContext(FlashContext);
    if (!context) throw new Error("useFlash must be used within FlashProvider");
    return context;
};
