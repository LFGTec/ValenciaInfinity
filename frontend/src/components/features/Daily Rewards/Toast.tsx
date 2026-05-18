import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export type ToastProps = {
    message: string;
    type: "success" | "error";
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
            <div
                className={`min-w-[320px] max-w-md rounded-lg shadow-2xl border-2 p-4 flex items-start gap-3 ${type === "success"
                    ? "bg-card border-vcf-orange"
                    : "bg-card border-red-500"
                    }`}
            >
                <div className="flex-shrink-0">
                    {type === "success" ? (
                        <div className="w-10 h-10 bg-vcf-orange rounded-full flex items-center justify-center">
                            <CheckCircle size={24} className="text-white" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                            <XCircle size={24} className="text-white" />
                        </div>
                    )}
                </div>

                <div className="flex-1 pt-1">
                    <h3
                        className={`font-black text-base mb-1 ${type === "success" ? "text-vcf-orange" : "text-red-500"
                            }`}
                    >
                        {type === "success" ? "¡ÉXITO!" : "¡ERROR!"}
                    </h3>
                    <p className="text-sm text-foreground font-bold">{message}</p>
                </div>

                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
