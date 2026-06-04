import { Moon, Sun } from "lucide-react";
import { ToggleItem } from "../ToggleItem";
import { useState } from "react";

interface UserConfigProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export default function UserConfig(){
    const [darkMode, setDarkMode] = useState(false);
    
    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };
    return (
        <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-5xl font-black mb-4 text-foreground">
            CONFIGURA<span className="text-vcf-orange">CIÓN</span>
            </h1>

            <p className="text-xl text-muted-foreground">
            Personaliza tu experiencia en la plataforma
            </p>
        </div>

        {/* Apariencia */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-foreground">
                    Modo Oscuro
                    </h4>
                    <p className="text-sm text-muted-foreground">
                    Cambia entre el tema claro y oscuro.
                    </p>
                </div>

                <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
                    darkMode
                        ? "bg-vcf-orange"
                        : "bg-muted"
                    }`}
                >
                    <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                        darkMode
                        ? "translate-x-8"
                        : "translate-x-1"
                    }`}
                    />
                </button>
                </div>

            </div>

            </div>
        </div>

        </div>
    );
}


  