import { createContext, useContext } from "react";
import type { Order } from "../types/order";

export interface CustomerContextType {
  customerName: string;
  setCustomerName: (name: string) => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
}

export const CustomerContext = createContext<CustomerContextType>({
  customerName: "",
  setCustomerName: () => {},
  lastOrder: null,
  setLastOrder: () => {},
});

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
