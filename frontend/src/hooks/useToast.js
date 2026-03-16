import { useCallback, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState({ title: "", message: "", type: "info", visible: false });

  const showToast = useCallback((title, message, type = "info") => {
    setToast({ title, message, type, visible: true });
    window.clearTimeout(window.__chronosToastTimer);
    window.__chronosToastTimer = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  return { toast, showToast, dismissToast: () => setToast((prev) => ({ ...prev, visible: false })) };
}
