import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { Snackbar, Alert, type AlertColor } from "@mui/material";

type ToastType = AlertColor;

interface Toast {
  id: number;
  message: string;
  severity: ToastType;
}

interface ToastContextType {
  showToast: (message: string, severity?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, severity: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, severity }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={4000}
          onClose={() => dismissToast(toast.id)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ marginTop: 70 }}
        >
          <Alert
            onClose={() => dismissToast(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}
