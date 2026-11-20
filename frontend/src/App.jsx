import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import PwaStatusBar from "./components/PwaStatusBar";
import SplashScreen from "./components/SplashScreen";
import DrinksPage from "./pages/DrinksPage";
import DrinkDetailPage from "./pages/DrinkDetailPage";
import SpicesPage from "./pages/SpicesPage";
import SpiceDetailPage from "./pages/SpiceDetailPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div className="min-h-screen w-full bg-[#FFFBF5]">
        <PwaStatusBar />
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