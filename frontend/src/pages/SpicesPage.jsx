import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Wind } from "lucide-react";
import { WedangApi } from "../services/api";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import Pagination from "../components/Pagination";
import FavoriteButton from "../components/FavoriteButton";
import OfflineNotice from "../components/OfflineNotice";

const ITEMS_PER_PAGE = 8;

export default function SpicesPage() {
  const isOnline = useOnlineStatus();
  const [spices, setSpices] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSpices = async (searchVal = search, pageVal = page) => {
    setLoading(true);
    setError(null);
    try {
      const result = await WedangApi.getSpices(
        searchVal,
        pageVal,
        ITEMS_PER_PAGE
      );
      setSpices(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSpices(search, page);
    }, 200);
    return () => clearTimeout(timer);
  }, [search, page, isOnline]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const startNum =
    pagination.totalItems === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endNum = Math.min(page * ITEMS_PER_PAGE, pagination.totalItems);

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24 md:pb-28">
      <header className="rounded-b-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 text-emerald-50 shadow-md">
        <div className="mx-auto max-w-6xl px-5 pt-7 pb-6 md:flex md:items-end md:justify-between md:gap-8 md:px-8 md:py-10">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest text-emerald-200 uppercase">
              Ensiklopedia Herbal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-4xl">
              Katalog Rempah Utama
            </h1>
            <p className="mt-1.5 text-xs text-emerald-100/85 md:text-sm">
              Kenali karakteristik aroma, senyawa aktif, serta khasiat rempah
              penyusun minuman tradisional.
            </p>
          </div>

          <div className="relative mt-4 w-full md:mt-0 md:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-emerald-900/60" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Cari jahe merah, secang, cengkeh..."
              className="w-full rounded-xl bg-white py-2.5 pr-4 pl-10 text-sm text-stone-800 shadow-sm outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-5 md:px-8 md:pt-7">
        {!loading && !error && pagination.totalItems > 0 && (
          <p className="mb-4 text-xs font-medium text-stone-500">
            Menampilkan {startNum}–{endNum} dari {pagination.totalItems} bahan
            rempah
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-56 animate-pulse rounded-2xl bg-emerald-100/50"
              />
            ))}
          </div>
        ) : error ? (
          <OfflineNotice
            isOffline={!isOnline || Boolean(error.isOffline)}
            title="Katalog Rempah Belum Tersedia Offline"
            message={
              !isOnline || error.isOffline
                ? "Tampilan aplikasi tetap dapat diakses, namun data katalog rempah halaman ini belum tersimpan di cache. Data akan dimuat otomatis saat online kembali."
                : error.message
            }
            onRetry={() => loadSpices()}
            accent="emerald"
          />
        ) : spices.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200/70 bg-white p-10 text-center">
            <p className="text-sm font-semibold text-stone-700">
              Bahan rempah tidak ditemukan
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {spices.map((spice) => (
                <Link
                  key={spice.id}
                  to={`/spices/${spice.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-sm transition-all hover:border-emerald-300 hover:shadow-md active:scale-[0.98]"
                >
                  <div className="relative h-32 w-full overflow-hidden md:h-40">
                    <img
                      src={spice.image_url}
                      alt={spice.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <FavoriteButton
                      type="spice"
                      item={spice}
                      className="absolute top-2 right-2"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-3.5 md:p-4">
                    <div>
                      <h2 className="text-sm font-bold text-stone-800 md:text-base">
                        {spice.name}
                      </h2>
                      <p className="mt-0.5 truncate text-[11px] italic text-emerald-700 md:text-xs">
                        {spice.scientific_name}
                      </p>
                    </div>
                    <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-stone-500 md:text-xs">
                      <Wind className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span className="line-clamp-2">
                        {spice.aroma_profile}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              accent="emerald"
            />
          </>
        )}
      </main>
    </div>
  );
}