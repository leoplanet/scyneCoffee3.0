import { useAuth } from "../../contexts/AuthContext";
import { useCustomer } from "../../contexts/CustomerContext";
import { useNavigate } from "react-router-dom";
import Cart from "../Cart";
import { Box, Button, Typography, Stack, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const { customerName } = useCustomer();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const displayName = user?.displayName || user?.email?.split("@")[0] || customerName;

  return (
    <Box
      sx={{
        height: 40,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Logo */}
      <Box
        sx={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <img
          src="https://cdn.prod.website-files.com/650aedb6397a7021a593e810/672ac5664163926064db6bd7_scyne-logo.svg"
          alt="Scyne Logo"
          style={{ height: "30px", width: "auto" }}
        />
      </Box>

      {/* Right side */}
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Customer Name (desktop) */}
        {displayName && (
          <Typography
            variant="body2"
            sx={{
              color: "white",
              display: { xs: "none", sm: "block" },
              maxWidth: 120,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Hi, {displayName}
          </Typography>
        )}

        {/* Cart Icon */}
        <Cart />

        {/* User Menu */}
        {user ? (
          <>
            <IconButton
              size="small"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{ color: "white" }}
            >
              <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main" }}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" style={{ width: "100%", borderRadius: "50%" }} />
                ) : (
                  <PersonOutlineIcon fontSize="small" />
                )}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
            >
              <MenuItem onClick={() => {
                setMenuAnchor(null);
                navigate("/orders");
              }}>
                My Orders
              </MenuItem>
              <MenuItem onClick={() => {
                setMenuAnchor(null);
                logout();
                navigate("/");
              }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.3)",
              "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            Login
          </Button>
        )}
      </Stack>
    </Box>
  );
}
