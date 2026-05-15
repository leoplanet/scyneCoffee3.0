import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { CartProvider } from "./contexts/CartProvider.tsx";
import { NotiProvider } from "./contexts/NotiProvider.tsx";
import ToastProvider from "./components/shared/ToastProvider.tsx";
import { theme } from "./theme/theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <NotiProvider>
              <App />
            </NotiProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </MUIThemeProvider>
  </StrictMode>
);
