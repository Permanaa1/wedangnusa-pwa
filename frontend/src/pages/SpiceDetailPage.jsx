import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Sprout,
  Wind,
  FlaskConical,
  HeartPulse,
  Coffee,
  AlertCircle,
} from "lucide-react";
import { WedangApi } from "../services/api";

export default function SpiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spice, setSpice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await WedangApi.getSpiceById(id);
        setSpice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] p-5 pb-24">
        <div className="h-56 animate-pulse rounded-3xl bg-emerald-100/60" />
        <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-emerald-100/60" />
        <div className="mt-3 h-28 animate-pulse rounded-2xl bg-emerald-100/40" />
      </div>
    );
  }

  if (error || !spice) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBF5] p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="mt-2 font-semibold text-stone-800">
          Detail bahan rempah tidak ditemukan
        </p>
        <p className="mt-1 text-xs text-stone-500">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24">
      {/* Hero Image */}
      <div className="relative h-60 w-full">
        <img
          src={spice.image_url}
          alt={spice.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md backdrop-blur-sm"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="absolute right-5 bottom-4 left-5 text-white">
          <p className="text-xs italic text-emerald-200">
            {spice.scientific_name}
          </p>
          <h1 className="mt-0.5 text-2xl font-bold">{spice.name}</h1>
          <p className="mt-1 text-xs text-stone-200">
            Nama lain: {spice.other_names}
          </p>
        </div>
      </div>

      <main className="space-y-4 px-5 pt-5">
        {/* Ringkasan Karakteristik */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-emerald-200/70 bg-white p-3.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <Sprout className="h-4 w-4" /> Bagian Dipakai
            </div>
            <p className="mt-1 text-xs text-stone-700">{spice.part_used}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200/70 bg-white p-3.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <Wind className="h-4 w-4" /> Profil Aroma
            </div>
            <p className="mt-1 text-xs text-stone-700">{spice.aroma_profile}</p>
          </div>
        </div>

        {/* Deskripsi */}
        <section className="rounded-2xl border border-emerald-200/70 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-stone-800">Deskripsi Bahan</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
            {spice.description}
          </p>
        </section>

        {/* Senyawa Aktif */}
        <section className="rounded-2xl border border-emerald-200/70 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-stone-800">
              Senyawa Bioaktif Utama
            </h2>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
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

        {/* Manfaat Herbal */}
        <section className="rounded-2xl border border-emerald-200/70 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-stone-800">Khasiat Herbal</h2>
          </div>
          <ul className="mt-2.5 space-y-2">
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

        {/* Dipakai pada Minuman */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-amber-800" />
            <h2 className="text-sm font-bold text-amber-950">
              Digunakan dalam Minuman
            </h2>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {spice.used_in_drinks?.map((drinkName, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-amber-900 shadow-xs"
              >
                {drinkName}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}