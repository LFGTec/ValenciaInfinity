import { Check } from "lucide-react";

const STEPS = ["Partido", "Asiento", "Pago", "Confirmación"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-start gap-0">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;

        return (
          <div key={n} className="flex items-start">
            {/* Paso */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                  done
                    ? "bg-green-100 text-green-600 border-2 border-green-400"
                    : active
                      ? "bg-black text-white shadow-sm"
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                }`}
              >
                {done ? <Check size={13} strokeWidth={3} /> : n}
              </div>
              <span
                className={`text-[9px] font-bold hidden lg:block leading-none ${
                  active
                    ? "text-black"
                    : done
                      ? "text-green-600"
                      : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Conector */}
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 mt-3.5 mx-0.5 rounded-full transition-all hidden sm:block ${
                  done ? "bg-green-300" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
