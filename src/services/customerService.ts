import { db } from "./firebase";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import type { Order } from "../types/order";

export interface CustomerDoc {
  id: string;
  name?: string;
  lastOrderId?: string;
  orderCount?: number;
  updatedAt?: { seconds: number; nanoseconds: number };
}

/**
 * Look up a customer by name and return their doc (with lastOrderId).
 * Name is stored lowercase with spaces replaced by underscores.
 */
export async function getCustomerByName(name: string): Promise<CustomerDoc | null> {
  const safeName = name.trim().toLowerCase().replace(/\s+/g, "_");
  const ref = doc(db, "customers", safeName);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as CustomerDoc) : null;
}

/**
 * Fetch an order by its ID.
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  const ref = doc(db, "orders", orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Order) };
}

/**
 * Fallback: find the most recent order for a customer name by searching orders collection.
 */
export async function findLastOrderByName(name: string): Promise<Order | null> {
  const q = query(
    collection(db, "orders"),
    where("customerName", "==", name.trim()),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docData = snap.docs[0].data() as Order;
  return { id: snap.docs[0].id, ...docData };
}
