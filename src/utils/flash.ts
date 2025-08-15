// utils/flash.ts
import Swal from "sweetalert2";

export const flash = (message: string, type: "success" | "error" | "info" = "info") => {
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
