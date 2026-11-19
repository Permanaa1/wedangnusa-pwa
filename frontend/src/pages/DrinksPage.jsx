import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Flame,
  Snowflake,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { WedangApi } from "../services/api";

const SERVING_FILTERS = ["Semua", "Hangat", "Dingin"];

export default function DrinksPage() {
  const [drinks, setDrinks] = useState([]);
  const [search, setSearch] = useState("");
  const [serving, setServing] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDrinks = async (searchVal = search, servingVal = serving) => {
    setLoading(true);
    setError(null);
    try {
      const data = await WedangApi.getDrinks(searchVal, servingVal);
      setDrinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDrinks(search, serving);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, serving]);

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24">
      {/* Header */}
      <header className="rounded-b-3xl bg-gradient-to-br from-amber-900 via-amber-800 to-orange-800 px-5 pt-7 pb-6 text-amber-50 shadow-md">
        <p className="text-xs font-semibold tracking-widest text-amber-200 uppercase">
          WedangNusa
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Minuman Rempah Nusantara
        </h1>
        <p className="mt-1 text-xs text-amber-100/85">
          Temukan racikan tradisional penghangat tubuh dan kebugaran dari
          berbagai daerah Indonesia.
        </p>

        {/* Search Input */}
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-amber-900/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari wedang uwuh, bandrek, sarabba..."
            className="w-full rounded-xl bg-white py-2.5 pr-4 pl-10 text-sm text-stone-800 shadow-sm outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-amber-300"
          />
        </div>
      </header>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 px-5 pt-4">
        {SERVING_FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setServing(item)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              serving === item
                ? "bg-amber-800 text-white shadow-sm"
                : "border border-amber-200 bg-white text-stone-600 hover:bg-amber-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="px-5 pt-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-28 animate-pulse rounded-2xl border border-amber-100 bg-amber-100/40"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="mt-2 text-sm font-semibold text-red-800">
              Gagal terhubung ke API
            </p>
            <p className="mt-1 text-xs text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => loadDrinks()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
            </button>
          </div>
        ) : drinks.length === 0 ? (
          <div className="rounded-2xl border border-amber-200/70 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-stone-700">
              Minuman tidak ditemukan
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Coba kata kunci lain atau ubah filter penyajian.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {drinks.map((drink) => (
              <Link
                key={drink.id}
                to={`/drinks/${drink.id}`}
                className="flex overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm transition-transform active:scale-[0.99]"
              >
                <img
                  src={drink.image_url}
                  alt={drink.name}
                  loading="lazy"
                  className="h-28 w-28 shrink-0 object-cover"
                />
                <div className="flex flex-1 flex-col justify-between p-3.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-bold text-stone-800">
                        {drink.name}
                      </h2>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                        {drink.serving_type.includes("Dingin") ? (
                          <Snowflake className="h-3 w-3 text-sky-600" />
                        ) : (
                          <Flame className="h-3 w-3 text-orange-600" />
                        )}
                        {drink.serving_type}
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
                      <MapPin className="h-3 w-3 text-amber-700" />
                      {drink.origin}
                    </p>
                  </div>

                  <p className="line-clamp-2 text-xs text-stone-600">
                    {drink.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}