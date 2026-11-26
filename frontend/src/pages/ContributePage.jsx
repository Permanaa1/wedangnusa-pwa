import { useState } from "react";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Trash2,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import { useSyncQueue } from "../context/SyncQueueContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const INITIAL_FORM = {
  name: "",
  origin: "",
  serving_type: "Hangat",
  category: "Penghangat Tubuh",
  image_url: "",
  description: "",
  ingredientsText: "",
  stepsText: "",
  benefitsText: "",
};

export default function ContributePage() {
  const isOnline = useOnlineStatus();
const {
    queue,
    pendingCount,
    isSyncing,
    lastSyncInfo,
    submitDrinkProposal,
    retryNow,
    removeQueuedItem,
  } = useSyncQueue();
  
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!form.name.trim() || !form.origin.trim() || !form.description.trim()) {
      setFeedback({
        type: "error",
        text: "Nama minuman, daerah asal, dan deskripsi wajib diisi.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        origin: form.origin.trim(),
        serving_type: form.serving_type,
        category: form.category,
        image_url: form.image_url.trim(),
        description: form.description.trim(),
        ingredients: form.ingredientsText,
        steps: form.stepsText,
        benefits: form.benefitsText,
      };

      const res = await submitDrinkProposal(payload);
      setFeedback({
        type: res.queued ? "pending" : "success",
        text: res.message,
      });
      setForm(INITIAL_FORM);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24 md:pb-28">
      {/* Header */}
      <header className="rounded-b-3xl bg-gradient-to-br from-amber-950 via-amber-900 to-orange-900 text-amber-50 shadow-md">
        <div className="mx-auto max-w-6xl px-5 pt-7 pb-6 md:px-8 md:py-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Kontribusi & Auto-Sync</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-4xl">
            Usulkan Minuman Rempah Baru
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs text-amber-100/85 md:text-sm">
            Tambahkan racikan minuman tradisional ke database. Jika sedang
            offline, data otomatis masuk antrean berstatus{" "}
            <span className="font-semibold text-amber-200">Pending</span> dan
            terkirim otomatis saat online kembali.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 pt-6 md:grid-cols-12 md:px-8">
        {/* Form Usulan (Kolom Kiri) */}
        <section className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-sm md:col-span-7 md:p-6">
          <h2 className="text-base font-bold text-stone-800 md:text-lg">
            Formulir Racikan Minuman
          </h2>

          {feedback && (
            <div
              className={`mt-4 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                feedback.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : feedback.type === "pending"
                    ? "border-amber-300 bg-amber-50 text-amber-950"
                    : "border-emerald-200 bg-emerald-50 text-emerald-900"
              }`}
            >
              {feedback.type === "pending" ? (
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700">
                  Nama Minuman *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Wedang Secang Jahe"
                  required
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700">
                  Daerah Asal *
                </label>
                <input
                  type="text"
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  placeholder="Contoh: Semarang, Jawa Tengah"
                  required
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700">
                  Penyajian
                </label>
                <select
                  name="serving_type"
                  value={form.serving_type}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
                >
                  <option value="Hangat">Hangat</option>
                  <option value="Dingin">Dingin</option>
                  <option value="Hangat / Dingin">Hangat / Dingin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700">
                  Kategori
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
                >
                  <option value="Penghangat Tubuh">Penghangat Tubuh</option>
                  <option value="Jamu & Kebugaran">Jamu & Kebugaran</option>
                  <option value="Minuman Tradisional">Minuman Tradisional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                URL Gambar (Opsional)
              </label>
              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Deskripsi Singkat *
              </label>
              <textarea
                name="description"
                rows={2}
                value={form.description}
                onChange={handleChange}
                placeholder="Ceritakan cita rasa, ciri khas, atau sejarah singkat minuman..."
                required
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Komposisi Bahan (Pisahkan per baris atau koma)
              </label>
              <textarea
                name="ingredientsText"
                rows={2}
                value={form.ingredientsText}
                onChange={handleChange}
                placeholder={"500 ml air\n2 ruas jahe memarkan\n30 gram kayu secang"}
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Langkah Pembuatan (Pisahkan per baris)
              </label>
              <textarea
                name="stepsText"
                rows={2}
                value={form.stepsText}
                onChange={handleChange}
                placeholder={"Rebus air bersama jahe hingga harum.\nMasukkan secang dan gula batu, saring lalu sajikan."}
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Manfaat Kesehatan (Pisahkan per baris atau koma)
              </label>
              <input
                type="text"
                name="benefitsText"
                value={form.benefitsText}
                onChange={handleChange}
                placeholder="Menghangatkan tubuh, meredakan masuk angin"
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2 text-sm text-stone-800 outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-900 disabled:opacity-60"
            >
              <PlusCircle className="h-4 w-4" />
              {submitting
                ? "Memproses..."
                : isOnline
                  ? "Kirim Usulan Minuman"
                  : "Simpan ke Antrean (Pending)"}
            </button>
          </form>
        </section>

        {/* Antrean Auto-Sync (Kolom Kanan) */}
        <section className="space-y-4 md:col-span-5">
          <div className="rounded-2xl border border-amber-300/80 bg-amber-50/70 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-amber-950">
                  Antrean Auto-Sync
                </h2>
                <p className="text-xs text-stone-600">
                  Menunggu sinkronisasi ke server: {pendingCount} item
                </p>
              </div>

             {pendingCount > 0 && isOnline && (
                <button
                  type="button"
                  onClick={retryNow}
                  disabled={isSyncing}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-amber-800 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-900 disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`}
                  />
                  {isSyncing ? "Sinkronisasi..." : "Sinkronkan Sekarang"}
                </button>
              )}
            </div>

            {!isOnline && pendingCount > 0 && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-100/90 px-3 py-2 text-xs font-medium text-amber-950">
                <WifiOff className="h-4 w-4 shrink-0 text-amber-800" />
                <span>
                  Perangkat offline. Item akan otomatis diunggah begitu koneksi
                  internet aktif kembali.
                </span>
              </div>
            )}

            {lastSyncInfo && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-100/90 px-3 py-2 text-xs font-medium text-emerald-900">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>
                  {lastSyncInfo.count} data pending berhasil tersinkronisasi ke
                  database.
                </span>
              </div>
            )}

            <div className="mt-4 space-y-2.5">
              {queue.length === 0 ? (
                <div className="rounded-xl border border-dashed border-amber-300 bg-white/70 p-5 text-center text-xs text-stone-500">
                  Tidak ada data yang tertahan di antrean saat ini.
                </div>
              ) : (
                queue.map((item) => (
                  <div
                    key={item.localId}
                    className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-white p-3.5 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            item.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {item.status === "failed" ? (
                            <>
                              <AlertTriangle className="h-3 w-3" /> Gagal — Coba
                              Lagi
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3" /> Pending
                            </>
                          )}
                        </span>
                        <span className="truncate text-[11px] text-stone-400">
                          {item.payload.origin}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-stone-800">
                        {item.payload.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-stone-500">
                        {item.payload.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeQueuedItem(item.localId)}
                      aria-label="Hapus dari antrean"
                      className="cursor-pointer rounded-lg p-1.5 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}