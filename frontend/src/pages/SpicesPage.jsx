import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Leaf, Wind, AlertCircle, RefreshCw } from "lucide-react";
import { WedangApi } from "../services/api";

export default function SpicesPage() {
  const [spices, setSpices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSpices = async (searchVal = search) => {
    setLoading(true);
    setError(null);
    try {
      const data = await WedangApi.getSpices(searchVal);
      setSpices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSpices(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24">
      {/* Header */}
      <header className="rounded-b-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 px-5 pt-7 pb-6 text-emerald-50 shadow-md">
        <p className="text-xs font-semibold tracking-widest text-emerald-200 uppercase">
          Ensiklopedia Herbal
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Katalog Rempah Utama
        </h1>
        <p className="mt-1 text-xs text-emerald-100/85">
          Kenali karakteristik aroma, senyawa aktif, serta khasiat rempah
          penyusun minuman tradisional.
        </p>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-emerald-900/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari jahe merah, secang, cengkeh..."
            className="w-full rounded-xl bg-white py-2.5 pr-4 pl-10 text-sm text-stone-800 shadow-sm outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-300"
          />
        </div>
      </header>

      {/* Grid List Rempah */}
      <main className="px-5 pt-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-3.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-52 animate-pulse rounded-2xl bg-emerald-100/50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="mt-2 text-sm font-semibold text-red-800">
              Gagal memuat katalog rempah
            </p>
            <p className="mt-1 text-xs text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => loadSpices()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
            </button>
          </div>
        ) : spices.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200/70 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-stone-700">
              Bahan rempah tidak ditemukan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {spices.map((spice) => (
              <Link
                key={spice.id}
                to={`/spices/${spice.id}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-sm transition-transform active:scale-[0.98]"
              >
                <img
                  src={spice.image_url}
                  alt={spice.name}
                  loading="lazy"
                  className="h-28 w-full object-cover"
                />
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <h2 className="text-sm font-bold text-stone-800">
                      {spice.name}
                    </h2>
                    <p className="mt-0.5 truncate text-[11px] italic text-emerald-700">
                      {spice.scientific_name}
                    </p>
                  </div>
                  <div className="mt-2.5 flex items-start gap-1 text-[11px] text-stone-500">
                    <Wind className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                    <span className="line-clamp-2">{spice.aroma_profile}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}