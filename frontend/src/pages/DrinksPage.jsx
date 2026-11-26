import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Flame,
  Snowflake,
  PlusCircle,
} from "lucide-react";
import { WedangApi } from "../services/api";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSyncQueue } from "../context/SyncQueueContext";
import Pagination from "../components/Pagination";
import FavoriteButton from "../components/FavoriteButton";
import OfflineNotice from "../components/OfflineNotice";

const SERVING_FILTERS = ["Semua", "Hangat", "Dingin"];
const ITEMS_PER_PAGE = 6;

export default function DrinksPage() {
  const isOnline = useOnlineStatus();
  const { pendingCount } = useSyncQueue();
  const [drinks, setDrinks] = useState([]);
  const [search, setSearch] = useState("");
  const [serving, setServing] = useState("Semua");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDrinks = async (
    searchVal = search,
    servingVal = serving,
    pageVal = page
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await WedangApi.getDrinks(
        searchVal,
        servingVal,
        pageVal,
        ITEMS_PER_PAGE
      );
      setDrinks(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDrinks(search, serving, page);
    }, 200);
    return () => clearTimeout(timer);
  }, [search, serving, page, isOnline]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleServingChange = (item) => {
    setServing(item);
    setPage(1);
  };

  const startNum =
    pagination.totalItems === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endNum = Math.min(page * ITEMS_PER_PAGE, pagination.totalItems);

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24 md:pb-28">
      <header className="rounded-b-3xl bg-gradient-to-br from-amber-900 via-amber-800 to-orange-800 text-amber-50 shadow-md">
        <div className="mx-auto max-w-6xl px-5 pt-7 pb-6 md:flex md:items-end md:justify-between md:gap-8 md:px-8 md:py-10">
          <div className="max-w-xl">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-widest text-amber-200 uppercase">
                WedangNusa
              </p>

              {/* Tombol menuju halaman /contribute di layar HP */}
              <Link
                to="/contribute"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-amber-50 ring-1 ring-amber-200/30 transition hover:bg-white/25 md:hidden"
              >
                <PlusCircle className="h-3.5 w-3.5 text-amber-200" />
                <span>Usulkan</span>
                {pendingCount > 0 && (
                  <span className="rounded-full bg-amber-300 px-1.5 py-0.2 text-[10px] font-bold text-amber-950">
                    {pendingCount}
                  </span>
                )}
              </Link>
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-4xl">
              Minuman Rempah Nusantara
            </h1>
            <p className="mt-1.5 text-xs text-amber-100/85 md:text-sm">
              Temukan racikan tradisional penghangat tubuh dan kebugaran dari
              berbagai daerah Indonesia.
            </p>
          </div>

          <div className="mt-4 flex w-full flex-col gap-2.5 md:mt-0 md:max-w-sm md:items-end">
            {/* Tombol menuju halaman /contribute di layar Desktop */}
            <Link
              to="/contribute"
              className="hidden items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-amber-50 ring-1 ring-amber-200/30 transition hover:bg-white/25 md:inline-flex"
            >
              <PlusCircle className="h-4 w-4 text-amber-200" />
              <span>Usulkan Minuman Baru</span>
              {pendingCount > 0 && (
                <span className="rounded-full bg-amber-300 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
                  {pendingCount} Pending
                </span>
              )}
            </Link>

            <div className="relative w-full">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-amber-900/60" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Cari wedang uwuh, bandrek, sarabba..."
                className="w-full rounded-xl bg-white py-2.5 pr-4 pl-10 text-sm text-stone-800 shadow-sm outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-2">
            {SERVING_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleServingChange(item)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all md:text-sm ${
                  serving === item
                    ? "bg-amber-800 text-white shadow-sm"
                    : "border border-amber-200 bg-white text-stone-600 hover:bg-amber-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {!loading && !error && pagination.totalItems > 0 && (
            <p className="text-xs font-medium text-stone-500">
              Menampilkan {startNum}–{endNum} dari {pagination.totalItems}{" "}
              minuman
            </p>
          )}
        </div>

        <main className="pt-4 md:pt-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-28 animate-pulse rounded-2xl border border-amber-100 bg-amber-100/40 md:h-72"
                />
              ))}
            </div>
          ) : error ? (
            <OfflineNotice
              isOffline={!isOnline || Boolean(error.isOffline)}
              title="Daftar Minuman Belum Tersedia Offline"
              message={
                !isOnline || error.isOffline
                  ? "Tampilan aplikasi tetap dapat digunakan, namun halaman daftar minuman ini belum tersimpan di cache. Data akan dimuat otomatis saat perangkat kembali online."
                  : error.message
              }
              onRetry={() => loadDrinks()}
              accent="amber"
            />
          ) : drinks.length === 0 ? (
            <div className="rounded-2xl border border-amber-200/70 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-stone-700">
                Minuman tidak ditemukan
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Coba kata kunci lain atau ubah filter penyajian.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {drinks.map((drink) => (
                  <Link
                    key={drink.id}
                    to={`/drinks/${drink.id}`}
                    className="group flex overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm transition-all hover:border-amber-300 hover:shadow-md active:scale-[0.99] md:flex-col"
                  >
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden md:h-48 md:w-full">
                      <img
                        src={drink.image_url}
                        alt={drink.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <FavoriteButton
                        type="drink"
                        item={drink}
                        className="absolute top-2 right-2"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-3.5 md:p-5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-base font-bold text-stone-800 md:text-lg">
                            {drink.name}
                          </h2>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-900 md:text-xs">
                            {drink.serving_type.includes("Dingin") ? (
                              <Snowflake className="h-3 w-3 text-sky-600" />
                            ) : (
                              <Flame className="h-3 w-3 text-orange-600" />
                            )}
                            {drink.serving_type}
                          </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                          <MapPin className="h-3.5 w-3.5 text-amber-700" />
                          {drink.origin}
                        </p>
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-600 md:mt-3 md:line-clamp-3 md:text-sm">
                        {drink.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                accent="amber"
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}