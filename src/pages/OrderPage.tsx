import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import type { Order } from "../types/order";
import OrderCard from "../components/OrderCard";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import type { OrderStatus } from "../types/order";

type TabValue = "active" | "all" | OrderStatus;

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState<TabValue>("active");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Get active (non-completed) orders by default
    const ordersRef = collection(db, "orders");
    let q: any;

    if (tabValue === "active") {
      q = query(ordersRef, where("status", "!=", "completed"), orderBy("createdAt", "asc"));
    } else if (tabValue === "all") {
      q = query(ordersRef, orderBy("createdAt", "desc"));
    } else {
      q = query(ordersRef, where("status", "==", tabValue), orderBy("createdAt", "asc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const fetchedOrders: Order[] = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...(doc.data() as Order),
      }));
      setOrders(fetchedOrders);

      // Count by status
      const counts: Record<string, number> = { active: 0 };
      const activeStatuses: OrderStatus[] = ["pending", "preparing", "ready"];
      fetchedOrders.forEach((o) => {
        const s = o.status || "pending";
        if (activeStatuses.includes(s)) {
          counts.active++;
        }
        counts[s] = (counts[s] || 0) + 1;
      });
      setStatusCounts(counts);
      setLoading(false);
    }, (error: Error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tabValue]);

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Orders
      </Typography>

      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 2, overflowX: "auto" }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ minHeight: 48 }}
        >
          <Tab label={`Active`} value="active" />
          <Tab label={`Pending${statusCounts.pending ? ` (${statusCounts.pending})` : ""}`} value="pending" />
          <Tab label={`Preparing${statusCounts.preparing ? ` (${statusCounts.preparing})` : ""}`} value="preparing" />
          <Tab label={`Ready${statusCounts.ready ? ` (${statusCounts.ready})` : ""}`} value="ready" />
          <Tab label="All" value="all" />
        </Tabs>
      </Paper>

      {/* Orders */}
      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <Typography>No orders found.</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Box>
      )}
    </Box>
  );
}
