import { useEffect, useState } from "react";
import { Coffee, Leaf } from "lucide-react";

export default function SplashScreen({ onFinish }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Mulai transisi fade-out pada 1.8 detik
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2800);

    // Lepas komponen setelah animasi fade-out selesai (450ms)
    const doneTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2250);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 px-6 text-amber-50 transition-all duration-500 ${
        isExiting
          ? "pointer-events-none scale-105 opacity-0"
          : "scale-100 opacity-100"
      }`}
    >
      {/* Dekorasi pendaran hangat di latar */}
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />

      {/* Konten Tengah */}
      <div className="relative flex flex-col items-center text-center">
        <div className="animate-splash-float relative flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-100/10 shadow-xl ring-1 ring-amber-300/35 backdrop-blur-sm">
          <Coffee className="h-12 w-12 text-amber-200" strokeWidth={1.8} />
          <div className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 ring-2 ring-amber-950">
            <Leaf className="h-4 w-4 text-emerald-100" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-amber-50 md:text-4xl">
          WedangNusa
        </h1>
        <p className="mt-1.5 max-w-xs text-xs text-amber-200/85 md:text-sm">
          Panduan Minuman Rempah Tradisional & Bahan Herbal Nusantara
        </p>

        {/* Loading Progress Bar */}
        <div className="mt-8 w-48 overflow-hidden rounded-full bg-amber-100/15 p-0.5">
          <div className="animate-splash-progress h-1.5 rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200" />
        </div>
        <p className="mt-2.5 text-[11px] font-medium tracking-wider text-amber-200/70 uppercase">
          Menyiapkan racikan rempah...
        </p>
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-[11px] text-amber-200/50">
        WedangNusa PWA • v1.0.0
      </p>
    </div>
  );
}