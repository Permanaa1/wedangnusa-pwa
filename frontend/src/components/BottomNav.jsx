import { NavLink } from "react-router-dom";
import { Coffee, Leaf, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Minuman", icon: Coffee, end: true },
  { to: "/spices", label: "Rempah", icon: Leaf, end: false },
  { to: "/profile", label: "Profil", icon: User, end: true },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-amber-200/80 bg-white/95 backdrop-blur-md md:right-auto md:bottom-5 md:left-1/2 md:w-[380px] md:-translate-x-1/2 md:rounded-full md:border md:shadow-xl">
      <div className="grid grid-cols-3 md:px-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors md:py-2 ${
                isActive
                  ? "text-amber-800"
                  : "text-stone-400 hover:text-stone-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`rounded-full px-4 py-1 transition-colors ${
                    isActive ? "bg-amber-100" : "bg-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.3 : 1.8} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}