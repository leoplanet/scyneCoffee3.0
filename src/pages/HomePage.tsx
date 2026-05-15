import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "../contexts/CustomerContext";
import { getCustomerByName, findLastOrderByName } from "../services/customerService";
import type { Order } from "../types/order";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HistoryIcon from "@mui/icons-material/History";
import Footer from "../components/Layout/Footer";

export default function HomePage() {
  const navigate = useNavigate();
  const { customerName, setCustomerName, setLastOrder } = useCustomer();

  const [nameInput, setNameInput] = useState(customerName);
  const [lastOrder, setLastOrderState] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedLastOrder, setCheckedLastOrder] = useState(false);

  // When component mounts, check if there's a saved name and fetch last order
  const checkLastOrder = useCallback(async () => {
    if (!customerName || checkedLastOrder) return;
    setCheckedLastOrder(true);
    setLoading(true);

    let foundOrder: Order | null = null;

    // Try customer doc first
    const customer = await getCustomerByName(customerName);
    if (customer?.lastOrderId) {
      const orderId = customer.lastOrderId;
      const m = await import("../services/customerService");
      foundOrder = await m.getOrderById(orderId);
    }

    // Fallback: search orders by name
    if (!foundOrder) {
      foundOrder = await findLastOrderByName(customerName);
    }

    if (foundOrder) {
      setLastOrderState(foundOrder);
      setLastOrder(foundOrder);
    }

    setLoading(false);
  }, [customerName, checkedLastOrder, setLastOrder]);

  // Run on mount if name exists
  useState(() => {
    if (customerName) checkLastOrder();
  });

  const handleEnter = async () => {
    if (!nameInput.trim()) return;

    setCustomerName(nameInput.trim());

    // Fetch last order for this name
    setLoading(true);
    let foundOrder: Order | null = null;

    const customer = await getCustomerByName(nameInput.trim());
    if (customer?.lastOrderId) {
      const orderId = customer.lastOrderId;
      const m = await import("../services/customerService");
      foundOrder = await m.getOrderById(orderId);
    }

    if (!foundOrder) {
      foundOrder = await findLastOrderByName(nameInput.trim());
    }

    if (foundOrder) {
      setLastOrderState(foundOrder);
      setLastOrder(foundOrder);
    }

    setLoading(false);
  };

  const handleOrderAgain = () => {
    // This will be handled by MenuPage reading lastOrder from context
    navigate("/menu");
  };

  const handleGuestContinue = () => {
    navigate("/menu");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        position: "relative",
      }}
    >
      {/* Main Content */}
      <Box sx={{ maxWidth: 480, width: "100%", mb: 4 }}>
        {/* Logo / Title */}
        <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "primary.main",
              mb: 1,
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "white",
              textAlign: "center",
            }}
          >
            scyneCoffee
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
            {lastOrder ? "Welcome back!" : "What's your name?"}
          </Typography>
        </Stack>

        {/* Name Input */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="Your Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnter()}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <PersonOutlineIcon sx={{ mr: 1, color: "action.disabled", fontSize: 20 }} />,
              }}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleEnter}
              disabled={!nameInput.trim() || loading}
              endIcon={<ArrowForwardIcon />}
            >
              {loading ? "Looking up..." : "Continue"}
            </Button>
          </Stack>
        </Paper>

        {/* Last Order Card */}
        {lastOrder && (
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 3,
              mt: 2,
              border: "1px solid rgba(112,105,213,0.3)",
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <HistoryIcon sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Your last order
                </Typography>
              </Stack>

              <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {lastOrder.items.length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Items
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
                    {lastOrder.items.slice(0, 3).map((item, i) => (
                      <Chip
                        key={i}
                        label={item.title}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", height: 22 }}
                      />
                    ))}
                    {lastOrder.items.length > 3 && (
                      <Chip label={`+${lastOrder.items.length - 3}`} size="small" sx={{ fontSize: "0.7rem", height: 22 }} />
                    )}
                  </Stack>
                </Box>
              </Stack>

              <Button
                variant="contained"
                fullWidth
                onClick={handleOrderAgain}
                sx={{ fontWeight: 600 }}
              >
                Order Again
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Guest Option */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="text"
            onClick={handleGuestContinue}
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            Browse menu without a name
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}
