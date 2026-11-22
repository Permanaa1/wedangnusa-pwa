import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Coffee, Leaf, MapPin, Wind, Trash2 } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import FavoriteButton from "../components/FavoriteButton";

export default function FavoritesPage() {
  const { favorites, totalFavorites, clearAllFavorites } = useFavorites();
  const [filter, setFilter] = useState("all");

  const showDrinks = filter === "all" || filter === "drinks";
  const showSpices = filter === "all" || filter === "spices";

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24 md:pb-28">
      {/* Header */}
      <header className="rounded-b-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-amber-900 text-rose-50 shadow-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 pt-7 pb-6 md:flex-row md:items-end md:justify-between md:px-8 md:py-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-rose-200">
              <Heart className="h-3.5 w-3.5 fill-rose-300 text-rose-300" />
              <span>Koleksi Tersimpan</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-4xl">
              Minuman & Rempah Favorit
            </h1>
            <p className="mt-1.5 text-xs text-rose-100/85 md:text-sm">
              Akses cepat racikan pilihan Anda kapan saja, tersimpan langsung di
              perangkat.
            </p>
          </div>

          {totalFavorites > 0 && (
            <button
              type="button"
              onClick={clearAllFavorites}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-rose-100 transition hover:bg-white/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Bersihkan Semua
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pt-5 md:px-8 md:pt-7">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: `Semua (${totalFavorites})` },
            { id: "drinks", label: `Minuman (${favorites.drinks.length})` },
            { id: "spices", label: `Rempah (${favorites.spices.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all md:text-sm ${
                filter === tab.id
                  ? "bg-rose-800 text-white shadow-sm"
                  : "border border-rose-200 bg-white text-stone-600 hover:bg-rose-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Isi Favorit */}
        <main className="mt-5 space-y-8">
          {totalFavorites === 0 ? (
            <div className="mx-auto max-w-md rounded-3xl border border-rose-200/70 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <Heart className="h-7 w-7" />
              </div>
              <h2 className="mt-3 text-base font-bold text-stone-800">
                Belum Ada Koleksi Favorit
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                Tekan ikon hati pada kartu minuman atau rempah untuk menyimpannya
                di halaman ini agar mudah dibuka kembali.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-900"
                >
                  <Coffee className="h-3.5 w-3.5" /> Jelajahi Minuman
                </Link>
                <Link
                  to="/spices"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900"
                >
                  <Leaf className="h-3.5 w-3.5" /> Jelajahi Rempah
                </Link>
              </div>
            </div>
          ) : (
            <>
              {showDrinks && favorites.drinks.length > 0 && (
                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-amber-800" />
                    <h2 className="text-base font-bold text-stone-800">
                      Minuman Favorit ({favorites.drinks.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {favorites.drinks.map((drink) => (
                      <Link
                        key={drink.id}
                        to={`/drinks/${drink.id}`}
                        className="group relative flex overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm transition hover:shadow-md md:flex-col"
                      >
                        <div className="relative h-28 w-28 shrink-0 overflow-hidden md:h-44 md:w-full">
                          <img
                            src={drink.image_url}
                            alt={drink.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <FavoriteButton
                            type="drink"
                            item={drink}
                            className="absolute top-2 right-2"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-3.5 md:p-4">
                          <div>
                            <h3 className="text-base font-bold text-stone-800">
                              {drink.name}
                            </h3>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
                              <MapPin className="h-3.5 w-3.5 text-amber-700" />
                              {drink.origin}
                            </p>
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs text-stone-600">
                            {drink.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {showSpices && favorites.spices.length > 0 && (
                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-emerald-700" />
                    <h2 className="text-base font-bold text-stone-800">
                      Rempah Favorit ({favorites.spices.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                    {favorites.spices.map((spice) => (
                      <Link
                        key={spice.id}
                        to={`/spices/${spice.id}`}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-sm transition hover:shadow-md"
                      >
                        <div className="relative h-28 w-full overflow-hidden md:h-36">
                          <img
                            src={spice.image_url}
                            alt={spice.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <FavoriteButton
                            type="spice"
                            item={spice}
                            className="absolute top-2 right-2"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-3">
                          <div>
                            <h3 className="text-sm font-bold text-stone-800">
                              {spice.name}
                            </h3>
                            <p className="mt-0.5 truncate text-[11px] italic text-emerald-700">
                              {spice.scientific_name}
                            </p>
                          </div>
                          <div className="mt-2 flex items-start gap-1 text-[11px] text-stone-500">
                            <Wind className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                            <span className="line-clamp-2">
                              {spice.aroma_profile}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {((filter === "drinks" && favorites.drinks.length === 0) ||
                (filter === "spices" && favorites.spices.length === 0)) && (
                <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
                  <p className="text-sm font-semibold text-stone-700">
                    Belum ada {filter === "drinks" ? "minuman" : "rempah"} di
                    daftar favorit.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}