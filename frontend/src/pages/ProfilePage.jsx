import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Coffee,
  User,
  GraduationCap,
  Hash,
  Server,
  Smartphone,
  CheckCircle2,
  WifiOff,
  Layers,
  ShieldCheck,
  Download,
  Trash2,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { WedangApi } from "../services/api";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSyncQueue } from "../context/SyncQueueContext";

export default function ProfilePage() {
  const isOnline = useOnlineStatus();
  const [apiOnline, setApiOnline] = useState(null);
  const [swReady, setSwReady] = useState(false);
  const [cacheCount, setCacheCount] = useState(() =>
    WedangApi.getCachedEntryCount()
  );
  const [cacheNotice, setCacheNotice] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(
    window.matchMedia("(display-mode: standalone)").matches
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(() => setSwReady(true))
        .catch(() => setSwReady(false));
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setApiOnline(false);
      return;
    }
    setApiOnline(null);
    WedangApi.getDrinks("", "Semua", 1, 1)
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, [isOnline]);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  const handleClearCache = async () => {
    WedangApi.clearApiCache();
    if ("caches" in window) {
      await caches.delete("wedangnusa-api-cache").catch(() => {});
    }
    setCacheCount(0);
    setCacheNotice(
      "Cache data API dibersihkan. Tampilan aplikasi tetap dapat diakses secara offline."
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24 md:pb-28">
      <header className="rounded-b-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 px-5 pt-8 pb-7 text-center text-amber-50 shadow-md md:py-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 ring-1 ring-amber-400/40">
          <Coffee className="h-8 w-8 text-amber-300" />
        </div>
        <h1 className="mt-3 text-2xl font-bold md:text-3xl">WedangNusa</h1>
        <p className="mt-1 text-xs text-amber-200/90 md:text-sm">
          Panduan Minuman Rempah Tradisional & Bahan Herbal
        </p>
        <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-amber-100">
          Progressive Web App • v1.1.0
        </span>
      </header>

      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-5 pt-5 md:grid-cols-2 md:gap-6 md:px-8 md:pt-8">
        {/* Kolom Kiri */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-amber-200/70 bg-white p-5 shadow-sm">
            <h2 className="text-xs font-bold tracking-wider text-stone-400 uppercase">
              Profil Pengembang
            </h2>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-400">Nama Praktikan</p>
                  <p className="text-sm font-bold text-stone-800">
                    Razzaq Permana
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <Hash className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-400">NIM</p>
                  <p className="font-mono text-sm font-semibold text-stone-800">
                    21120123120016
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-400">Program Studi</p>
                  <p className="text-sm font-semibold text-stone-800">
                    Teknik Komputer — Universitas Diponegoro
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-amber-800" />
              <h2 className="text-sm font-bold text-stone-800">
                Tentang Aplikasi
              </h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-stone-600 md:text-sm">
              WedangNusa adalah aplikasi Progressive Web App (PWA) untuk Tugas
              Akhir Praktikum Pemrograman Perangkat Bergerak (PPB). Aplikasi ini
              menyajikan katalog minuman rempah Nusantara, ensiklopedia rempah,
              panduan racik berdasarkan keluhan, dan koleksi favorit yang tetap
              dapat dibuka secara luring.
            </p>
          </section>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-amber-300/80 bg-amber-50/70 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-900" />
                <h2 className="text-sm font-bold text-amber-950">
                  Dukungan PWA & Mode Offline
                </h2>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  swReady
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {swReady ? "SW Aktif" : "Menyiapkan SW"}
              </span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-stone-600">
              Kerangka antarmuka aplikasi tersimpan otomatis oleh Service Worker
              sehingga tetap bisa diakses saat offline tanpa perlu di-install.
              Halaman yang pernah dibuka otomatis tersimpan di cache, sedangkan
              data baru akan dimuat ulang ketika koneksi internet kembali aktif.
            </p>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2">
                <span className="text-stone-500">Status Jaringan</span>
                <span
                  className={`font-semibold ${
                    isOnline ? "text-emerald-700" : "text-amber-800"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2">
                <span className="text-stone-500">Data API di Cache Lokal</span>
                <span className="font-semibold text-stone-700">
                  {cacheCount} entri tersimpan
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {installPrompt && !isInstalled && (
                <button
                  type="button"
                  onClick={handleInstallApp}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-900"
                >
                  <Download className="h-3.5 w-3.5" />
                  Install Aplikasi (Opsional)
                </button>
              )}

              <button
                type="button"
                onClick={handleClearCache}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3.5 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Bersihkan Cache Data
              </button>
            </div>

            {isInstalled && (
              <p className="mt-2.5 text-xs font-medium text-emerald-700">
                Aplikasi berjalan dalam mode PWA Standalone.
              </p>
            )}

            {cacheNotice && (
              <p className="mt-2.5 text-xs font-medium text-amber-900">
                {cacheNotice}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-amber-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-amber-800" />
                <h2 className="text-sm font-bold text-stone-800">
                  Status Web Service
                </h2>
              </div>
              {!isOnline ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
                  <WifiOff className="h-3.5 w-3.5" /> Mode Offline
                </span>
              ) : apiOnline === true ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Terhubung
                </span>
              ) : apiOnline === false ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
                  Tidak Terjangkau
                </span>
              ) : (
                <span className="text-[11px] text-stone-400">Memeriksa...</span>
              )}
            </div>

            <div className="mt-3 space-y-2 text-xs text-stone-600">
              <div className="flex items-center justify-between gap-2 rounded-lg bg-stone-50 px-3 py-2">
                <span className="shrink-0 text-stone-400">Endpoint API</span>
                <span className="truncate font-mono font-medium text-stone-700">
                  {WedangApi.baseUrl}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg bg-stone-50 px-3 py-2">
                <span className="flex shrink-0 items-center gap-1 text-stone-400">
                  <Layers className="h-3.5 w-3.5" /> Stack
                </span>
                <span className="text-right font-medium text-stone-700">
                  React + Vite PWA • Express • Supabase
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}