import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Thermometer,
  ListChecks,
  ChefHat,
  HeartPulse,
  AlertCircle,
} from "lucide-react";
import { WedangApi } from "../services/api";

export default function DrinkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await WedangApi.getDrinkById(id);
        setDrink(data);
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
        <div className="h-60 animate-pulse rounded-3xl bg-amber-100/60" />
        <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-amber-100/60" />
        <div className="mt-3 h-24 animate-pulse rounded-2xl bg-amber-100/40" />
      </div>
    );
  }

  if (error || !drink) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBF5] p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="mt-2 font-semibold text-stone-800">
          Detail minuman tidak ditemukan
        </p>
        <p className="mt-1 text-xs text-stone-500">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 rounded-xl bg-amber-800 px-5 py-2.5 text-xs font-semibold text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24">
      {/* Hero Image */}
      <div className="relative h-64 w-full">
        <img
          src={drink.image_url}
          alt={drink.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md backdrop-blur-sm"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="absolute right-5 bottom-4 left-5 text-white">
          <span className="inline-block rounded-full bg-amber-600/90 px-3 py-0.5 text-[11px] font-semibold">
            {drink.category}
          </span>
          <h1 className="mt-1.5 text-2xl font-bold">{drink.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-amber-100">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {drink.origin}
            </span>
            <span className="flex items-center gap-1">
              <Thermometer className="h-3.5 w-3.5" /> Saji {drink.serving_type}
            </span>
          </div>
        </div>
      </div>

      {/* Detail Sections */}
      <main className="space-y-4 px-5 pt-5">
        {/* Deskripsi */}
        <section className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-amber-950">Tentang Minuman</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
            {drink.description}
          </p>
        </section>

        {/* Komposisi Bahan */}
        <section className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-amber-700" />
            <h2 className="text-sm font-bold text-amber-950">
              Komposisi & Takaran Bahan
            </h2>
          </div>
          <ul className="mt-2.5 space-y-2">
            {drink.ingredients?.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-stone-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cara Penyeduhan */}
        <section className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-amber-700" />
            <h2 className="text-sm font-bold text-amber-950">
              Cara Perebusan & Penyajian
            </h2>
          </div>
          <ol className="mt-3 space-y-3">
            {drink.steps?.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-stone-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Manfaat Kesehatan */}
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-emerald-950">
              Manfaat Kesehatan
            </h2>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {drink.benefits?.map((benefit, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-emerald-900"
              >
                <span>•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}