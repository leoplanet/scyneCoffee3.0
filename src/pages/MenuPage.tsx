import { useEffect, useState, useCallback } from "react";
import { useCart } from "../contexts/CartContext";
import { useCustomer } from "../contexts/CustomerContext";
import { useToast } from "../components/shared/ToastProvider";
import { db } from "../services/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import type { Coffee } from "../types/coffee";
import type { OrderItem } from "../types/order";
import MenuItemCard from "../components/MenuItemCard";
import CoffeeModal from "../components/forms/CoffeeModal";
import CartDrawer from "../components/CartDrawer";
import MenuSearchbar from "../components/MenuSearchbar";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

export default function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<Coffee[]>([]);
  const [selectedItem, setSelectedItem] = useState<Coffee | null>(null);
  const [filteredItems, setFilteredItems] = useState<Coffee[]>([]);
  const [maxPopularity, setMaxPopularity] = useState(0);
  const [loading, setLoading] = useState(true);

  const { addToCart, openCart } = useCart();
  const { customerName, lastOrder } = useCustomer();
  const { showToast } = useToast();

  // Real-time menu fetch
  useEffect(() => {
    const menuCollection = collection(db, "coffee");
    const q = query(menuCollection, orderBy("category", "asc"), orderBy("popularity", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const menuList: Coffee[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          category: data.category,
          imageUrl: data.imageUrl,
          isAvailable: data.isAvailable,
          tags: data.tags,
          popularity: data.popularity,
          hotOnly: data.hotOnly,
          defaultMilk: data.defaultMilk,
        };
      });
      setMenuItems(menuList);
      setFilteredItems(menuList);

      const maxPop = menuList.reduce(
        (max, item) => (item.popularity > max ? item.popularity : max),
        0
      );
      setMaxPopularity(maxPop);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching menu:", error);
      showToast("Failed to load menu. Check Firestore indexes.", "error");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [showToast]);

  // Search
  const onSearch = useCallback((term: string) => {
    term = term.trim();
    if (!term) {
      setFilteredItems(menuItems);
      return;
    }
    const lower = term.toLowerCase();
    const result = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(lower)))
    );
    setFilteredItems(result);
  }, [menuItems]);

  // Quick-add: add default item to cart
  const handleQuickAdd = useCallback((coffee: Coffee) => {
    const item: OrderItem = {
      coffeeId: coffee.id,
      title: coffee.name,
      isHot: !coffee.hotOnly,
      isXHot: false,
      isIced: false,
      isDecaf: false,
      strength: 1,
      milk: coffee.defaultMilk || "none",
      quantity: 1,
      isCompleted: false,
      extraWater: 0,
      teaBags: 0,
      sugar: 0,
      sweetner: 0,
      price: 0,
    };
    addToCart(item);
    showToast(`${coffee.name} added to cart`, "success");
  }, [addToCart, showToast]);

  // Order Again from last order
  const handleOrderAgain = useCallback(() => {
    if (!lastOrder) return;
    lastOrder.items.forEach((item) => {
      addToCart({
        ...item,
        isCompleted: false,
      });
    });
    showToast(`Last order added to cart (${lastOrder.items.length} items)`, "success");
    openCart();
  }, [lastOrder, addToCart, showToast, openCart]);

  return (
    <Box sx={{ pb: 4 }}>
      {/* Last Order Banner */}
      {lastOrder && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <HistoryIcon color="primary" />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Welcome back, {customerName}!
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last order: {lastOrder.items.map((i) => i.title).join(", ")}
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            size="small"
            onClick={handleOrderAgain}
            sx={{ whiteSpace: "nowrap" }}
          >
            Order Again
          </Button>
        </Paper>
      )}

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <MenuSearchbar onSearch={onSearch} />
      </Box>

      {/* Menu Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredItems.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <Typography>No items found.</Typography>
        </Box>
      ) : (
        <Box className="menu-grid">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              coffee={item}
              maxPopularity={maxPopularity}
              onSelect={() => {
                if (item.isAvailable) {
                  setSelectedItem(item);
                  setIsModalOpen(true);
                }
              }}
              onQuickAdd={() => {
                if (item.isAvailable) {
                  handleQuickAdd(item);
                }
              }}
            />
          ))}
        </Box>
      )}

      {/* Coffee Customization Modal */}
      {isModalOpen && selectedItem && (
        <CoffeeModal
          coffee={selectedItem}
          isOpen={true}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </Box>
  );
}
