import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import DrinksPage from "./pages/DrinksPage";
import DrinkDetailPage from "./pages/DrinkDetailPage";
import SpicesPage from "./pages/SpicesPage";
import SpiceDetailPage from "./pages/SpiceDetailPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto min-h-screen w-full max-w-md bg-[#FFFBF5] shadow-xl">
        <Routes>
          <Route path="/" element={<DrinksPage />} />
          <Route path="/drinks/:id" element={<DrinkDetailPage />} />
          <Route path="/spices" element={<SpicesPage />} />
          <Route path="/spices/:id" element={<SpiceDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}