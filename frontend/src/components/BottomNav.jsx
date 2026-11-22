import { Link, useLocation } from "react-router-dom";
import { Coffee, Leaf, HeartPulse, Heart, User } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

const navItems = [
  {
    to: "/",
    label: "Minuman",
    icon: Coffee,
    match: (path) => path === "/" || path.startsWith("/drinks"),
  },
  {
    to: "/spices",
    label: "Rempah",
    icon: Leaf,
    match: (path) => path.startsWith("/spices"),
  },
  {
    to: "/remedies",
    label: "Khasiat",
    icon: HeartPulse,
    match: (path) => path.startsWith("/remedies"),
  },
  {
    to: "/favorites",
    label: "Favorit",
    icon: Heart,
    match: (path) => path.startsWith("/favorites"),
    showBadge: true,
  },
  {
    to: "/profile",
    label: "Profil",
    icon: User,
    match: (path) => path.startsWith("/profile"),
  },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { totalFavorites } = useFavorites();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-amber-200/80 bg-white/95 backdrop-blur-md md:right-auto md:bottom-5 md:left-1/2 md:w-[500px] md:-translate-x-1/2 md:rounded-full md:border md:shadow-xl">
      <div className="grid grid-cols-5 px-1 md:px-3">
        {navItems.map(({ to, label, icon: Icon, match, showBadge }) => {
          const isActive = match(pathname);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors md:py-2 ${
                isActive
                  ? "text-amber-800"
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              <div
                className={`relative rounded-full px-3 py-1 transition-colors ${
                  isActive ? "bg-amber-100" : "bg-transparent"
                }`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {showBadge && totalFavorites > 0 && (
                  <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white">
                    {totalFavorites > 9 ? "9+" : totalFavorites}
                  </span>
                )}
              </div>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}