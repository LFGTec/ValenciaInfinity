import { useState } from "react";
import { updatePassword } from "../services/authService";

export function usePasswordChange() {
  const [loading, setLoading] = useState(false);

  const updatePassword = async (
    newPassword: string
  ) => {
    try {
      setLoading(true);

      await updatePassword(newPassword);

      return {
        success: true,
        error: null,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePassword,
    loading,
  };
}