import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "wedangnusa_favorites_v1";

const FavoritesContext = createContext(null);

function loadInitialFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { drinks: [], spices: [] };
    const parsed = JSON.parse(raw);
    return {
      drinks: Array.isArray(parsed.drinks) ? parsed.drinks : [],
      spices: Array.isArray(parsed.spices) ? parsed.spices : [],
    };
  } catch {
    return { drinks: [], spices: [] };
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadInitialFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Abaikan jika penyimpanan browser penuh
    }
  }, [favorites]);

  const isDrinkFavorite = (id) =>
    favorites.drinks.some((item) => String(item.id) === String(id));

  const isSpiceFavorite = (id) =>
    favorites.spices.some((item) => String(item.id) === String(id));

  const toggleFavoriteDrink = (drink) => {
    setFavorites((prev) => {
      const exists = prev.drinks.some(
        (item) => String(item.id) === String(drink.id)
      );
      return {
        ...prev,
        drinks: exists
          ? prev.drinks.filter((item) => String(item.id) !== String(drink.id))
          : [drink, ...prev.drinks],
      };
    });
  };

  const toggleFavoriteSpice = (spice) => {
    setFavorites((prev) => {
      const exists = prev.spices.some(
        (item) => String(item.id) === String(spice.id)
      );
      return {
        ...prev,
        spices: exists
          ? prev.spices.filter((item) => String(item.id) !== String(spice.id))
          : [spice, ...prev.spices],
      };
    });
  };

  const clearAllFavorites = () => {
    setFavorites({ drinks: [], spices: [] });
  };

  const totalFavorites = favorites.drinks.length + favorites.spices.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        totalFavorites,
        isDrinkFavorite,
        isSpiceFavorite,
        toggleFavoriteDrink,
        toggleFavoriteSpice,
        clearAllFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites harus dipakai di dalam FavoritesProvider");
  }
  return ctx;
}