import { Link } from "react-router-dom";
import { WifiOff, AlertCircle, RefreshCw, Heart } from "lucide-react";

export default function OfflineNotice({
  isOffline,
  title,
  message,
  onRetry,
  accent = "amber",
}) {
  const accentBtn =
    accent === "emerald"
      ? "bg-emerald-800 hover:bg-emerald-900"
      : accent === "teal"
        ? "bg-teal-800 hover:bg-teal-900"
        : "bg-amber-800 hover:bg-amber-900";

  if (isOffline) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-amber-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
          <WifiOff className="h-7 w-7" />
        </div>
        <h2 className="mt-3 text-base font-bold text-stone-800">
          {title || "Anda Sedang dalam Mode Offline"}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
          {message ||
            "Tampilan aplikasi tetap dapat diakses secara offline, namun data ini belum tersimpan di perangkat. Data akan dimuat otomatis saat koneksi internet kembali tersedia."}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition ${accentBtn}`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Coba Muat Ulang
            </button>
          )}
          <Link
            to="/favorites"
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <Heart className="h-3.5 w-3.5" />
            Buka Favorit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-red-200 bg-red-50/80 p-6 text-center">
      <AlertCircle className="mx-auto h-9 w-9 text-red-500" />
      <h2 className="mt-2.5 text-sm font-bold text-red-900">
        Gagal Memuat Data
      </h2>
      <p className="mt-1 text-xs text-red-700">
        {message || "Server API sedang tidak dapat dijangkau. Silakan coba lagi."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}