import { useState } from "react";
import { updatePassword } from "../../services/authService";
import { Toast } from "../ui.disabled/Toast";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";



export default function ChangePasswordForm() {
  const { signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleUpdatePassword = async () => {
  if (!newPassword || !confirmPassword) {
    setToast({
      type: "error",
      message: "Completa todos los campos",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    setToast({
      type: "error",
      message: "Las contraseñas no coinciden",
    });
    return;
  }

  if (newPassword.length < 8) {
    setToast({
      type: "error",
      message:
        "La contraseña debe tener al menos 8 caracteres",
    });
    return;
  }

  setLoading(true);

  const { error } = await updatePassword(
    currentPassword,
    newPassword
  );

  if (!error) {
    setToast({
      type: "success",
      message: "Contraseña actualizada. Vuelve a iniciar sesión.",
    });

    setTimeout(async () => {
      await signOut();
      <Navigate to="/login" replace />
    }, 2000);
  }

  setLoading(false);

  if (error) {
    setToast({
      type: "error",
      message: error,
    });
    return;
  }

  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");

};

  return (
    <div className="bg-card border-2 border-border rounded-lg p-8 shadow-md">
      <h3 className="text-2xl font-black mb-6 text-foreground">
        CAMBIAR{" "}
        <span className="text-vcf-orange">
          CONTRASEÑA
        </span>
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block font-bold mb-2 text-sm text-foreground">
            Contraseña Actual
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm text-foreground">
            Nueva Contraseña
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
          />
        </div>
        <div className="mt-3 space-y-1 text-sm">
          <div
          className={`flex items-center gap-2 ${
            newPassword.length >= 8
              ? "text-green-500"
              : "text-muted-foreground"
          }`}
        >
          <Check size={16} />
          <span>Al menos 8 caracteres</span>
        </div>
          <div
            className={`flex items-center gap-2 ${
              /[A-Z]/.test(newPassword)
                ? "text-green-500"
                : "text-muted-foreground"
            }`}
          >
            <Check size={16} />
            <span>Una letra mayúscula</span>
          </div>

          <div
            className={`flex items-center gap-2 ${
              /[a-z]/.test(newPassword)
                ? "text-green-500"
                : "text-muted-foreground"
            }`}
          >
            <Check size={16} />
            <span>Una letra minúscula</span>
          </div>

          <div
            className={`flex items-center gap-2 ${
              /\d/.test(newPassword)
                ? "text-green-500"
                : "text-muted-foreground"
            }`}
          >
            <Check size={16} />
            <span>Un número</span>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm text-foreground">
            Confirmar Nueva Contraseña
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
          />
        </div>

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="w-full py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "ACTUALIZANDO..."
            : "ACTUALIZAR CONTRASEÑA"}
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}