import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Sprout,
  Wind,
  FlaskConical,
  HeartPulse,
  Coffee,
} from "lucide-react";
import { WedangApi } from "../services/api";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import FavoriteButton from "../components/FavoriteButton";
import OfflineNotice from "../components/OfflineNotice";

export default function SpiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [spice, setSpice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await WedangApi.getSpiceById(id);
      setSpice(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id, isOnline]);

  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-5xl bg-[#FFFBF5] p-5 pb-24 md:p-8">
        <div className="h-60 animate-pulse rounded-3xl bg-emerald-100/60" />
        <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-emerald-100/60" />
        <div className="mt-3 h-28 animate-pulse rounded-2xl bg-emerald-100/40" />
      </div>
    );
  }

  if (error || !spice) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBF5] px-5 pb-24">
        <OfflineNotice
          isOffline={!isOnline || Boolean(error?.isOffline)}
          title="Detail Rempah Belum Tersimpan Offline"
          message={
            !isOnline || error?.isOffline
              ? "Halaman detail rempah ini belum pernah dibuka saat online. Data akan otomatis dimuat ketika koneksi internet kembali aktif."
              : error?.message || "Detail bahan rempah tidak ditemukan."
          }
          onRetry={loadDetail}
          accent="emerald"
        />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-emerald-900 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke halaman sebelumnya
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24 md:pb-28">
      <div className="mx-auto max-w-5xl md:px-8 md:pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 hidden cursor-pointer items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-xs hover:bg-emerald-50 md:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog Rempah
        </button>

        <div className="relative h-60 w-full overflow-hidden md:h-72 md:rounded-3xl md:shadow-md">
          <img
            src={spice.image_url}
            alt={spice.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md backdrop-blur-sm md:hidden"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <FavoriteButton
            type="spice"
            item={spice}
            className="absolute top-4 right-4 h-10 w-10 shadow-md"
          />

          <div className="absolute right-5 bottom-4 left-5 text-white md:right-8 md:bottom-6 md:left-8">
            <p className="text-xs italic text-emerald-200 md:text-sm">
              {spice.scientific_name}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold md:text-4xl">
              {spice.name}
            </h1>
            <p className="mt-1 text-xs text-stone-200 md:text-sm">
              Nama lain: {spice.other_names}
            </p>
          </div>
        </div>

        <main className="grid grid-cols-1 gap-4 px-5 pt-5 md:grid-cols-12 md:gap-6 md:px-0 md:pt-6">
          <div className="space-y-4 md:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-200/70 bg-white p-3.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <Sprout className="h-4 w-4" /> Bagian Dipakai
                </div>
                <p className="mt-1.5 text-xs text-stone-700 md:text-sm">
                  {spice.part_used}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200/70 bg-white p-3.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <Wind className="h-4 w-4" /> Profil Aroma
                </div>
                <p className="mt-1.5 text-xs text-stone-700 md:text-sm">
                  {spice.aroma_profile}
                </p>
              </div>
            </div>

            <section className="rounded-2xl border border-emerald-200/70 bg-white p-4 shadow-sm md:p-5">
              <h2 className="text-sm font-bold text-stone-800 md:text-base">
                Deskripsi Bahan
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {spice.description}
              </p>
            </section>
          </div>

          <div className="space-y-4 md:col-span-7">
            <section className="rounded-2xl border border-emerald-200/70 bg-white p-4 shadow-sm md:p-5">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-stone-800 md:text-base">
                  Senyawa Bioaktif Utama
                </h2>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {spice.active_compounds?.map((compound, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                  >
                    {compound}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-200/70 bg-white p-4 shadow-sm md:p-5">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-stone-800 md:text-base">
                  Khasiat Herbal
                </h2>
              </div>
              <ul className="mt-3 space-y-2">
                {spice.benefits?.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-stone-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm md:p-5">
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-amber-800" />
                <h2 className="text-sm font-bold text-amber-950 md:text-base">
                  Digunakan dalam Minuman
                </h2>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {spice.used_in_drinks?.map((drinkName, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-xs"
                  >
                    {drinkName}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}