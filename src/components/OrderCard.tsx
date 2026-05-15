import { useState } from "react";
import type { Order, OrderStatus } from "../types/order";
import { db } from "../services/firebase";
import { updateDoc, doc, writeBatch, increment } from "firebase/firestore";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: "default" | "primary" | "success" | "warning" }> = {
  pending: { label: "Pending", color: "default" },
  preparing: { label: "Preparing", color: "warning" },
  ready: { label: "Ready", color: "primary" },
  completed: { label: "Completed", color: "success" },
};

const STATUS_FLOW: OrderStatus[] = ["pending", "preparing", "ready", "completed"];

export default function OrderCard({ order }: { order: Order }) {
  const { customerName, id, items, status } = order;
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(status || "pending");

  const statusIndex = STATUS_FLOW.indexOf(currentStatus);
  const isComplete = currentStatus === "completed";

  const advanceStatus = async (orderId: string) => {
    if (!orderId || isComplete) return;
    const nextIndex = statusIndex + 1;
    if (nextIndex >= STATUS_FLOW.length) return;

    setUpdating(true);
    try {
      const orderRef = doc(db, "orders", orderId);
      const newStatus = STATUS_FLOW[nextIndex];
      await updateDoc(orderRef, {
        status: newStatus,
        isCompleted: newStatus === "completed",
      });
      setCurrentStatus(newStatus);

      // On completion, batch update popularity
      if (newStatus === "completed") {
        const batch = writeBatch(db);
        items.forEach((item) => {
          if (!item.coffeeId) return;
          const coffeeRef = doc(db, "coffee", item.coffeeId);
          batch.update(coffeeRef, { popularity: increment(item.quantity) });
        });
        await batch.commit();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(false);
    }
  };

  const nextStatusLabel = isComplete ? "Completed" : STATUS_FLOW[statusIndex + 1]?.replace("-", " ") || "Complete";

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6">
            {customerName}
          </Typography>
          <Chip
            label={STATUS_CONFIG[currentStatus]?.label || currentStatus}
            color={STATUS_CONFIG[currentStatus]?.color || "default"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Items */}
        <Stack spacing={1}>
          {items.map((item, index) => (
            <Paper
              key={`${item.title}-${index}`}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {item.title}
                {item.quantity > 1 && <Typography component="span" sx={{ ml: 1, opacity: 0.7 }}>×{item.quantity}</Typography>}
              </Typography>

              <Box sx={{ pl: 1, mt: 0.5 }}>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                  {item.isIced && <Typography variant="body2">🧊 Iced</Typography>}
                  {!item.isIced && item.isXHot && <Typography variant="body2" color="error">🔥 Extra Hot</Typography>}
                  {item.isDecaf && <Typography variant="body2">🛑 Decaf</Typography>}
                  {item.milk !== "none" && <Typography variant="body2">🥛 {item.milk}</Typography>}
                </Stack>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                  {item.strength && item.strength !== 1 && (
                    <Typography variant="body2">☕ Strength: {item.strength}</Typography>
                  )}
                  {item.teaBags > 0 && <Typography variant="body2">🍵 Bags: {item.teaBags}</Typography>}
                  {item.sugar > 0 && <Typography variant="body2">🍭 Sugar: {item.sugar}</Typography>}
                  {item.sweetner > 0 && <Typography variant="body2">🍬 Sweetener: {item.sweetner}</Typography>}
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Footer */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            ID: {id}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => advanceStatus(id || "")}
            disabled={updating || isComplete}
            startIcon={updating && <CircularProgress size={16} color="inherit" />}
          >
            {isComplete ? "✓ Completed" : `Mark as ${nextStatusLabel}`}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
