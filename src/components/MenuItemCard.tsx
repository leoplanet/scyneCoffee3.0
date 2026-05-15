import type { Coffee } from "../types/coffee";
import { Card, CardMedia, Box, Typography, Chip, Stack, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function MenuItemCard(props: {
  coffee: Coffee;
  onSelect: () => void;
  onQuickAdd?: () => void;
  maxPopularity?: number;
}) {
  const { name, description, imageUrl, popularity, isAvailable, tags } = props.coffee;
  const maxPopularity = props.maxPopularity || 1;

  const raw = (Math.sqrt(popularity) / Math.sqrt(maxPopularity)) * 5;
  const starNumber = popularity > 0 ? Math.max(1, Math.ceil(raw)) : 0;
  const stars = "★".repeat(starNumber) + "☆".repeat(5 - starNumber);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: isAvailable ? "pointer" : "default",
        opacity: isAvailable ? 1 : 0.6,
        "&:hover": {
          transform: isAvailable ? "translateY(-4px)" : "none",
          boxShadow: isAvailable ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
        },
      }}
      onClick={(e) => {
        // Don't trigger card click when clicking the quick-add button
        if ((e.target as HTMLElement).closest("[data-quick-add]")) return;
        if (isAvailable) {
          props.onSelect();
        }
      }}
    >
      {/* Image */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={imageUrl || "/placeholder-coffee.jpg"}
          alt={name}
          sx={{
            height: 180,
            objectFit: "cover",
          }}
        />
        {!isAvailable && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Chip label="Unavailable" size="small" sx={{ bgcolor: "rgba(0,0,0,0.7)", color: "white" }} />
          </Box>
        )}

        {/* Quick Add Button */}
        {isAvailable && (
          <IconButton
            data-quick-add
            onClick={(e) => {
              e.stopPropagation();
              props.onQuickAdd?.();
            }}
            size="small"
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 0.5 }}>
          {name}
        </Typography>

        {/* Popularity Stars */}
        {popularity > 0 && (
          <Typography
            variant="body2"
            sx={{
              color: "gold",
              mb: 1,
              fontSize: "0.85rem",
              letterSpacing: 1,
            }}
          >
            {stars}
          </Typography>
        )}

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 1.5,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "0.8rem",
          }}
        >
          {description}
        </Typography>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
            {tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.65rem",
                  height: 20,
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "text.secondary",
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Card>
  );
}
