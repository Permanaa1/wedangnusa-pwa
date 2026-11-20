const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CACHE_KEYS = {
  drinks: "wedangnusa_drinks_offline",
  spices: "wedangnusa_spices_offline",
  meta: "wedangnusa_offline_meta",
};

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Abaikan jika kuota penyimpanan penuh
  }
}

function paginateLocal(items, page, limit) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      totalItems,
      totalPages,
    },
  };
}

async function fetchApi(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Request gagal (${response.status})`);
  }
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.message || "Gagal memuat data");
  }
  return json;
}

export const WedangApi = {
  baseUrl: API_BASE_URL,

  async getDrinks(search = "", serving = "Semua", page = 1, limit = 6) {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    if (serving && serving !== "Semua") params.append("serving", serving);
    params.append("page", String(page));
    params.append("limit", String(limit));

    try {
      const json = await fetchApi(`/drinks?${params.toString()}`);

      // Sinkronisasi cache penuh sekali di latar belakang jika belum ada
      if (!readCache(CACHE_KEYS.drinks)) {
        fetchApi("/drinks")
          .then((all) => writeCache(CACHE_KEYS.drinks, all.data))
          .catch(() => {});
      }

      return {
        data: json.data,
        pagination: json.pagination ?? {
          page,
          limit,
          totalItems: json.data.length,
          totalPages: 1,
        },
      };
    } catch (err) {
      const cached = readCache(CACHE_KEYS.drinks);
      if (cached) {
        const filtered = cached.filter((item) => {
          const matchSearch =
            !search.trim() ||
            item.name.toLowerCase().includes(search.trim().toLowerCase());
          const matchServing =
            serving === "Semua" ||
            item.serving_type.toLowerCase().includes(serving.toLowerCase());
          return matchSearch && matchServing;
        });
        return paginateLocal(filtered, page, limit);
      }
      throw err;
    }
  },

  async getDrinkById(id) {
    try {
      const json = await fetchApi(`/drinks/${id}`);
      return json.data;
    } catch (err) {
      const cached = readCache(CACHE_KEYS.drinks);
      const found = cached?.find((item) => String(item.id) === String(id));
      if (found) return found;
      throw err;
    }
  },

  async getSpices(search = "", page = 1, limit = 8) {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    params.append("page", String(page));
    params.append("limit", String(limit));

    try {
      const json = await fetchApi(`/spices?${params.toString()}`);

      if (!readCache(CACHE_KEYS.spices)) {
        fetchApi("/spices")
          .then((all) => writeCache(CACHE_KEYS.spices, all.data))
          .catch(() => {});
      }

      return {
        data: json.data,
        pagination: json.pagination ?? {
          page,
          limit,
          totalItems: json.data.length,
          totalPages: 1,
        },
      };
    } catch (err) {
      const cached = readCache(CACHE_KEYS.spices);
      if (cached) {
        const filtered = cached.filter(
          (item) =>
            !search.trim() ||
            item.name.toLowerCase().includes(search.trim().toLowerCase())
        );
        return paginateLocal(filtered, page, limit);
      }
      throw err;
    }
  },

  async getSpiceById(id) {
    try {
      const json = await fetchApi(`/spices/${id}`);
      return json.data;
    } catch (err) {
      const cached = readCache(CACHE_KEYS.spices);
      const found = cached?.find((item) => String(item.id) === String(id));
      if (found) return found;
      throw err;
    }
  },

  // Unduh seluruh data API & gambar ke cache agar siap dipakai offline
  async downloadAllForOffline() {
    const [drinksRes, spicesRes] = await Promise.all([
      fetchApi("/drinks"),
      fetchApi("/spices"),
    ]);

    const drinks = drinksRes.data;
    const spices = spicesRes.data;

    writeCache(CACHE_KEYS.drinks, drinks);
    writeCache(CACHE_KEYS.spices, spices);

    const imageUrls = [
      ...new Set([
        ...drinks.map((d) => d.image_url),
        ...spices.map((s) => s.image_url),
      ]),
    ];

    await Promise.allSettled(
      imageUrls.map((url) => fetch(url, { mode: "no-cors" }))
    );

    const meta = {
      syncedAt: new Date().toISOString(),
      drinksCount: drinks.length,
      spicesCount: spices.length,
    };
    writeCache(CACHE_KEYS.meta, meta);
    return meta;
  },

  getOfflineMeta() {
    return readCache(CACHE_KEYS.meta);
  },
};