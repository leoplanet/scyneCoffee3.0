import { useState, useCallback, type ReactNode } from "react";
import { CustomerContext } from "./CustomerContext";
import type { Order } from "../types/order";

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customerName, setCustomerNameState] = useState(() => {
    // Restore from localStorage
    return localStorage.getItem("scyne_customer_name") ?? "";
  });
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const setCustomerName = useCallback((name: string) => {
    setCustomerNameState(name);
    if (name) {
      localStorage.setItem("scyne_customer_name", name);
    } else {
      localStorage.removeItem("scyne_customer_name");
    }
  }, []);

  return (
    <CustomerContext.Provider
      value={{ customerName, setCustomerName, lastOrder, setLastOrder }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
