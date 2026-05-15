import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useCustomer } from "../contexts/CustomerContext";
import { useToast } from "../components/shared/ToastProvider";
import type { Order } from "../types/order";
import { Timestamp } from "firebase/firestore";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";

export default function CartDrawer() {
  const { cartItems, removeFromCart, clearCart, isCartOpen, toggleCart, submitOrder } = useCart();
  const { customerName } = useCustomer();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const now = Timestamp.now();
  const order: Order = {
    items: cartItems,
    customerName: customerName || "Guest",
    total: 0,
    isCompleted: false,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty.", "warning");
      return;
    }

    setSubmitting(true);
    const orderNum = await submitOrder(order, customerName || "Guest");
    setSubmitting(false);

    if (orderNum !== null) {
      showToast(`Order placed! Your order is being prepared.`, "success");
      toggleCart();
    } else {
      showToast("Failed to place order. Please try again.", "error");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={toggleCart}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 380 },
          maxWidth: "100vw",
        },
      }}
    >
      <Box
        sx={{
          width: 380,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalCafeIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Your Cart
            </Typography>
            <Badge
              badgeContent={cartItems.length}
              color="primary"
              sx={{ ml: 1 }}
            />
          </Stack>
          <IconButton onClick={toggleCart} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Customer Name Display */}
        {customerName && (
          <Box sx={{ px: 2, pt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Ordering as: <strong>{customerName}</strong>
            </Typography>
          </Box>
        )}

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {cartItems.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                color: "text.secondary",
              }}
            >
              <LocalCafeIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
              <Typography>Your cart is empty</Typography>
              <Typography variant="body2">Add some coffees from the menu!</Typography>
            </Box>
          ) : (
            <List dense>
              {cartItems.map((item, index) => (
                <Box key={index}>
                  <ListItem
                    divider
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => removeFromCart(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={item.title}
                      secondary={
                        <>
                          {item.isIced ? "Iced" : item.isHot ? "Hot" : ""}
                          {item.milk !== "none" ? ` • ${item.milk} milk` : ""}
                          {item.quantity > 1 ? ` • ×${item.quantity}` : ""}
                        </>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={1.5}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || submitting}
              sx={{ fontWeight: 600 }}
            >
              {submitting ? "Placing Order..." : `Place Order (${cartItems.length})`}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={clearCart}
              disabled={cartItems.length === 0}
            >
              Clear Cart
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
