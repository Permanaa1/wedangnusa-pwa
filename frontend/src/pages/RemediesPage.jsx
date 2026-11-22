import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Sparkles,
  Coffee,
  Leaf,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { WedangApi } from "../services/api";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import FavoriteButton from "../components/FavoriteButton";
import OfflineNotice from "../components/OfflineNotice";

const SYMPTOM_PRESETS = [
  {
    id: "masuk-angin",
    label: "Masuk Angin & Kedinginan",
    tip: "Sajikan minuman berbahan jahe bakar, serai, atau secang dalam kondisi hangat untuk membantu melancarkan peredaran darah.",
    keywords: ["masuk angin", "hangat", "dingin", "peredaran darah", "sirkulasi darah"],
  },
  {
    id: "batuk-flu",
    label: "Batuk & Tenggorokan",
    tip: "Kombinasi jahe merah, kencur, cengkeh, dan gula aren membantu melegakan saluran napas dan meredakan tenggorokan gatal.",
    keywords: ["batuk", "tenggorokan", "flu", "pernapasan", "hidung"],
  },
  {
    id: "pegal-stamina",
    label: "Pegal & Pemulihan Stamina",
    tip: "Racikan beras kencur, wedang uwuh, atau bir pletok cocok diminum setelah beraktivitas berat untuk mengurangi rasa lelah.",
    keywords: ["pegal", "lelah", "stamina", "energi", "nyeri", "otot"],
  },
  {
    id: "pencernaan",
    label: "Perut Kembung & Pencernaan",
    tip: "Serai, kapulaga, dan daun pandan membantu menenangkan lambung serta mengurangi rasa begah atau mual.",
    keywords: ["kembung", "lambung", "pencernaan", "mual", "perut"],
  },
  {
    id: "panas-dalam",
    label: "Panas Dalam & Penyegar",
    tip: "Pilih minuman berbahan asam jawa, daun sinom, dan kunyit yang dapat dinikmati dingin untuk menyegarkan tubuh.",
    keywords: ["panas dalam", "menyegarkan", "segar", "metabolisme", "vitamin c"],
  },
  {
    id: "imunitas",
    label: "Imunitas & Antioksidan",
    tip: "Kandungan kurkumin, brazilin, dan gingerol berperan penting menjaga daya tahan tubuh dan menangkal radikal bebas.",
    keywords: ["antioksidan", "imunitas", "daya tahan", "antiinflamasi", "hati", "radikal bebas"],
  },
  {
    id: "relaksasi",
    label: "Relaksasi & Tidur Nyenyak",
    tip: "Aroma daun pandan, pala, serai, dan kapulaga memberikan efek menenangkan sebelum beristirahat di malam hari.",
    keywords: ["relaksasi", "tidur", "stres", "kecemasan", "menenangkan"],
  },
];

function matchKeywords(item, keywords) {
  const haystack = [
    ...(item.benefits || []),
    item.description || "",
    item.category || "",
    item.aroma_profile || "",
  ]
    .join(" ")
    .toLowerCase();

  return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

function getMatchedBenefit(item, keywords) {
  const found = (item.benefits || []).find((benefit) =>
    keywords.some((kw) => benefit.toLowerCase().includes(kw.toLowerCase()))
  );
  return found || item.benefits?.[0] || item.description;
}

export default function RemediesPage() {
  const isOnline = useOnlineStatus();
  const [selectedId, setSelectedId] = useState(SYMPTOM_PRESETS[0].id);
  const [drinks, setDrinks] = useState([]);
  const [spices, setSpices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allDrinks, allSpices] = await Promise.all([
        WedangApi.getAllDrinks(),
        WedangApi.getAllSpices(),
      ]);
      setDrinks(allDrinks);
      setSpices(allSpices);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isOnline]);

  const activePreset = useMemo(
    () => SYMPTOM_PRESETS.find((p) => p.id === selectedId) || SYMPTOM_PRESETS[0],
    [selectedId]
  );

  const recommendedDrinks = useMemo(
    () => drinks.filter((d) => matchKeywords(d, activePreset.keywords)),
    [drinks, activePreset]
  );

  const recommendedSpices = useMemo(
    () => spices.filter((s) => matchKeywords(s, activePreset.keywords)),
    [spices, activePreset]
  );

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24 md:pb-28">
      <header className="rounded-b-3xl bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-800 text-teal-50 shadow-md">
        <div className="mx-auto max-w-6xl px-5 pt-7 pb-6 md:px-8 md:py-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-teal-200">
            <HeartPulse className="h-3.5 w-3.5" />
            <span>Panduan Racik Herbal</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-4xl">
            Cari Berdasarkan Keluhan & Khasiat
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs text-teal-100/85 md:text-sm">
            Pilih kondisi tubuh yang sedang dirasakan untuk menemukan rekomendasi
            minuman tradisional dan bahan rempah yang paling sesuai.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pt-5 md:px-8 md:pt-7">
        {/* Pilihan Keluhan & Saran tetap bisa diakses saat offline */}
        <section>
          <p className="text-xs font-bold tracking-wider text-stone-400 uppercase">
            Pilih Kondisi / Kebutuhan
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {SYMPTOM_PRESETS.map((preset) => {
              const isActive = preset.id === selectedId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedId(preset.id)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-all md:text-sm ${
                    isActive
                      ? "bg-teal-800 text-white shadow-sm"
                      : "border border-teal-200 bg-white text-stone-700 hover:bg-teal-50"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
          <div>
            <p className="text-xs font-bold text-teal-950 md:text-sm">
              Saran Racikan: {activePreset.label}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-teal-900/85 md:text-sm">
              {activePreset.tip}
            </p>
          </div>
        </div>

        <main className="mt-6 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-36 animate-pulse rounded-2xl bg-teal-100/50"
                />
              ))}
            </div>
          ) : error ? (
            <OfflineNotice
              isOffline={!isOnline || Boolean(error.isOffline)}
              title="Daftar Rekomendasi Memerlukan Koneksi"
              message={
                !isOnline || error.isOffline
                  ? "Panduan saran racikan di atas tetap dapat dibaca secara offline. Daftar kartu rekomendasi minuman & rempah akan dimuat otomatis saat koneksi internet kembali tersedia."
                  : error.message
              }
              onRetry={loadData}
              accent="teal"
            />
          ) : (
            <>
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-amber-800" />
                  <h2 className="text-base font-bold text-stone-800 md:text-lg">
                    Rekomendasi Minuman ({recommendedDrinks.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendedDrinks.map((drink) => (
                    <Link
                      key={drink.id}
                      to={`/drinks/${drink.id}`}
                      className="group relative flex overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm transition hover:border-amber-300 hover:shadow-md md:flex-col"
                    >
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden md:h-40 md:w-full">
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
                      <div className="flex flex-1 flex-col justify-between p-3.5 md:p-4">
                        <div>
                          <h3 className="text-sm font-bold text-stone-800 md:text-base">
                            {drink.name}
                          </h3>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-stone-500">
                            <MapPin className="h-3 w-3 text-amber-700" />
                            {drink.origin}
                          </p>
                          <p className="mt-2 line-clamp-2 text-xs text-teal-800">
                            Khasiat:{" "}
                            {getMatchedBenefit(drink, activePreset.keywords)}
                          </p>
                        </div>
                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800">
                          Lihat racikan <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-700" />
                  <h2 className="text-base font-bold text-stone-800 md:text-lg">
                    Bahan Rempah Pendukung ({recommendedSpices.length})
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                  {recommendedSpices.map((spice) => (
                    <Link
                      key={spice.id}
                      to={`/spices/${spice.id}`}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                    >
                      <div className="relative h-28 w-full overflow-hidden md:h-36">
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
                      <div className="flex flex-1 flex-col justify-between p-3">
                        <div>
                          <h3 className="text-sm font-bold text-stone-800">
                            {spice.name}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-[11px] text-emerald-800">
                            {getMatchedBenefit(spice, activePreset.keywords)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}