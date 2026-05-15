import { useState, useEffect, useCallback, type ReactNode } from "react";
import { CartContext } from "./CartContext";
import type { CartContextType } from "./CartContext";
import type { OrderItem, Order } from "../types/order";
import { db } from "../services/firebase";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const CART_STORAGE_KEY = "scyne_cart";

// Load cart from localStorage
const loadCart = (): OrderItem[] => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItemsState] = useState<OrderItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((newItem: OrderItem) => {
    setCartItemsState((prev) => [...prev, newItem]);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCartItemsState((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCartItemsState([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  // Submit order to Firestore + upsert customer doc for last-order tracking
  const submitOrder = useCallback(
    async (order: Order, customerName: string): Promise<number | null> => {
      if (cartItems.length === 0) return null;

      try {
        const now = Timestamp.now();
        const orderData = {
          ...order,
          customerName: customerName.trim(),
          status: "pending" as const,
          isCompleted: false,
          createdAt: now,
          updatedAt: now,
        };

        // Add order
        const ordersCollection = collection(db, "orders");
        const orderRef = await addDoc(ordersCollection, orderData);

        // Generate a human-friendly order number from timestamp
        const orderNum = now.seconds % 100000;

        // Upsert customer doc for last-order tracking
        const safeName = customerName.trim().toLowerCase().replace(/\s+/g, "_");
        const customerRef = doc(db, "customers", safeName);
        const customerSnap = await getDoc(customerRef);

        await setDoc(
          customerRef,
          {
            name: customerName.trim(),
            lastOrderId: orderRef.id,
            orderCount: (customerSnap.exists() ? (customerSnap.data().orderCount || 0) : 0) + 1,
            updatedAt: now,
          },
          { merge: true }
        );

        setOrderNumber(orderNum);
        setCartItemsState([]); // clear cart
        return orderNum;
      } catch (error) {
        console.error("Error submitting order:", error);
        return null;
      }
    },
    [cartItems]
  );

  const value: CartContextType & {
    openCart: () => void;
    orderNumber: number | null;
    submitOrder: (order: Order, customerName: string) => Promise<number | null>;
  } = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    toggleCart,
    openCart,
    orderNumber,
    submitOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
