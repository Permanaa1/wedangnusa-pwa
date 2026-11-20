import { useEffect, useState } from "react";
import {
  Coffee,
  User,
  GraduationCap,
  Hash,
  Server,
  Smartphone,
  CheckCircle2,
  XCircle,
  Layers,
  HardDriveDownload,
  Download,
  RefreshCw,
} from "lucide-react";
import { WedangApi } from "../services/api";

export default function ProfilePage() {
  const [apiOnline, setApiOnline] = useState(null);
  const [offlineMeta, setOfflineMeta] = useState(() =>
    WedangApi.getOfflineMeta()
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(
    window.matchMedia("(display-mode: standalone)").matches
  );

  useEffect(() => {
    WedangApi.getDrinks()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));

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

  const handleDownloadOffline = async () => {
    setDownloading(true);
    setDownloadMsg("");
    try {
      const meta = await WedangApi.downloadAllForOffline();
      setOfflineMeta(meta);
      setDownloadMsg(
        `Berhasil menyimpan ${meta.drinksCount} minuman & ${meta.spicesCount} rempah untuk akses offline.`
      );
    } catch {
      setDownloadMsg(
        "Gagal mengunduh data. Pastikan perangkat sedang terhubung ke internet dan API aktif."
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24 md:pb-28">
      {/* Header */}
      <header className="rounded-b-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 px-5 pt-8 pb-7 text-center text-amber-50 shadow-md md:py-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 ring-1 ring-amber-400/40">
          <Coffee className="h-8 w-8 text-amber-300" />
        </div>
        <h1 className="mt-3 text-2xl font-bold md:text-3xl">WedangNusa</h1>
        <p className="mt-1 text-xs text-amber-200/90 md:text-sm">
          Panduan Minuman Rempah Tradisional & Bahan Herbal
        </p>
        <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-amber-100">
          Progressive Web App • v1.0.0
        </span>
      </header>

      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-5 pt-5 md:grid-cols-2 md:gap-6 md:px-8 md:pt-8">
        {/* Kolom Kiri */}
        <div className="space-y-4">
          {/* Identitas Pengembang */}
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
                    Teknik Komputer - Universitas Diponegoro
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tentang Aplikasi */}
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
              menyajikan katalog minuman rempah Nusantara beserta takaran
              racikan, langkah penyeduhan, dan ensiklopedia bahan herbal yang
              dapat diakses secara daring maupun luring (offline).
            </p>
          </section>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-4">
          {/* Mode Offline & Install PWA */}
          <section className="rounded-2xl border border-amber-300/80 bg-amber-50/70 p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <HardDriveDownload className="h-4 w-4 text-amber-900" />
              <h2 className="text-sm font-bold text-amber-950">
                Akses Offline & Instalasi PWA
              </h2>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
              Simpan seluruh data minuman dan rempah ke perangkat agar aplikasi
              tetap bisa dibuka saat tidak ada koneksi internet.
            </p>

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={handleDownloadOffline}
                disabled={downloading}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-800 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-900 disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${downloading ? "animate-spin" : ""}`}
                />
                {downloading ? "Menyimpan..." : "Unduh Data Offline"}
              </button>

              {installPrompt && !isInstalled && (
                <button
                  type="button"
                  onClick={handleInstallApp}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-amber-800 bg-white px-4 py-2.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
                >
                  <Download className="h-4 w-4" />
                  Install Aplikasi
                </button>
              )}
            </div>

            {isInstalled && (
              <p className="mt-2.5 text-xs font-medium text-emerald-700">
                Aplikasi sudah terpasang dalam mode PWA Standalone.
              </p>
            )}

            {downloadMsg && (
              <p className="mt-2.5 text-xs font-medium text-amber-900">
                {downloadMsg}
              </p>
            )}

            {offlineMeta && (
              <p className="mt-2 text-[11px] text-stone-500">
                Sinkronisasi terakhir:{" "}
                {new Date(offlineMeta.syncedAt).toLocaleString("id-ID")} (
                {offlineMeta.drinksCount} minuman, {offlineMeta.spicesCount}{" "}
                rempah)
              </p>
            )}
          </section>

          {/* Status REST API */}
          <section className="rounded-2xl border border-amber-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-amber-800" />
                <h2 className="text-sm font-bold text-stone-800">
                  Status Web Service
                </h2>
              </div>
              {apiOnline === true ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Terhubung
                </span>
              ) : apiOnline === false ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
                  <XCircle className="h-3.5 w-3.5" /> Offline
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