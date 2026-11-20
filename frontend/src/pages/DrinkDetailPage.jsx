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
      <div className="mx-auto min-h-screen max-w-5xl bg-[#FFFBF5] p-5 pb-24 md:p-8">
        <div className="h-64 animate-pulse rounded-3xl bg-amber-100/60" />
        <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-amber-100/60" />
        <div className="mt-3 h-32 animate-pulse rounded-2xl bg-amber-100/40" />
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
          className="mt-4 cursor-pointer rounded-xl bg-amber-800 px-5 py-2.5 text-xs font-semibold text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24 md:pb-28">
      <div className="mx-auto max-w-5xl md:px-8 md:pt-8">
        {/* Tombol Kembali Desktop */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 hidden cursor-pointer items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-xs hover:bg-amber-50 md:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Minuman
        </button>

        {/* Hero Image */}
        <div className="relative h-64 w-full overflow-hidden md:h-80 md:rounded-3xl md:shadow-md">
          <img
            src={drink.image_url}
            alt={drink.name}
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

          <div className="absolute right-5 bottom-4 left-5 text-white md:right-8 md:bottom-6 md:left-8">
            <span className="inline-block rounded-full bg-amber-600/90 px-3 py-0.5 text-[11px] font-semibold md:text-xs">
              {drink.category}
            </span>
            <h1 className="mt-1.5 text-2xl font-bold md:text-4xl">
              {drink.name}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-amber-100 md:text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {drink.origin}
              </span>
              <span className="flex items-center gap-1.5">
                <Thermometer className="h-4 w-4" /> Saji {drink.serving_type}
              </span>
            </div>
          </div>
        </div>

        {/* Grid 2 Kolom di Desktop */}
        <main className="grid grid-cols-1 gap-4 px-5 pt-5 md:grid-cols-12 md:gap-6 md:px-0 md:pt-6">
          {/* Kolom Kiri */}
          <div className="space-y-4 md:col-span-5">
            <section className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm md:p-5">
              <h2 className="text-sm font-bold text-amber-950 md:text-base">
                Tentang Minuman
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {drink.description}
              </p>
            </section>

            <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm md:p-5">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-emerald-950 md:text-base">
                  Manfaat Kesehatan
                </h2>
              </div>
              <ul className="mt-2.5 space-y-2">
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
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4 md:col-span-7">
            <section className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm md:p-5">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-amber-700" />
                <h2 className="text-sm font-bold text-amber-950 md:text-base">
                  Komposisi & Takaran Bahan
                </h2>
              </div>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {drink.ingredients?.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl bg-amber-50/60 px-3 py-2 text-sm text-stone-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm md:p-5">
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-amber-700" />
                <h2 className="text-sm font-bold text-amber-950 md:text-base">
                  Cara Perebusan & Penyajian
                </h2>
              </div>
              <ol className="mt-3 space-y-3">
                {drink.steps?.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-stone-700"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}