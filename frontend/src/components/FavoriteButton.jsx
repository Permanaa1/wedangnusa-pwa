import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoriteButton({ type, item, className = "" }) {
  const {
    isDrinkFavorite,
    isSpiceFavorite,
    toggleFavoriteDrink,
    toggleFavoriteSpice,
  } = useFavorites();

  const active =
    type === "drink" ? isDrinkFavorite(item.id) : isSpiceFavorite(item.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "drink") {
      toggleFavoriteDrink(item);
    } else {
      toggleFavoriteSpice(item);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Hapus dari favorit" : "Simpan ke favorit"}
      title={active ? "Hapus dari favorit" : "Simpan ke favorit"}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition active:scale-90 ${
        active
          ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
          : "bg-white/90 text-stone-500 hover:text-rose-500"
      } ${className}`}
    >
      <Heart className={`h-4 w-4 ${active ? "fill-rose-500 text-rose-500" : ""}`} />
    </button>
  );
}