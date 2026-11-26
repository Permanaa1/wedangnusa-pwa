const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CACHE_PREFIX = "wedangnusa_api_v2:";

function readCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Abaikan jika kuota penyimpanan browser penuh
  }
}

function createOfflineError() {
  const err = new Error(
    "Koneksi terputus. Data akan dimuat otomatis saat Anda kembali online."
  );
  err.isOffline = true;
  return err;
}

async function fetchApi(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Request gagal (${response.status})`);
    }
    const json = await response.json();
    if (!json.success) {
      throw new Error(json.message || "Gagal memuat data");
    }
    return json;
  } catch (err) {
    if (!navigator.onLine) {
      throw createOfflineError();
    }
    throw err;
  }
}

export const WedangApi = {
  baseUrl: API_BASE_URL,

  async getDrinks(search = "", serving = "Semua", page = 1, limit = 6) {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    if (serving && serving !== "Semua") params.append("serving", serving);
    params.append("page", String(page));
    params.append("limit", String(limit));

    const queryKey = `drinks:${params.toString()}`;

    try {
      const json = await fetchApi(`/drinks?${params.toString()}`);
      const result = {
        data: json.data,
        pagination: json.pagination ?? {
          page,
          limit,
          totalItems: json.data.length,
          totalPages: 1,
        },
      };
      writeCache(queryKey, result);
      json.data.forEach((item) => writeCache(`drink:${item.id}`, item));
      return result;
    } catch (err) {
      const cached = readCache(queryKey);
      if (cached) return { ...cached, fromCache: true };
      throw err;
    }
  },

  async getDrinkById(id) {
    const cacheKey = `drink:${id}`;
    try {
      const json = await fetchApi(`/drinks/${id}`);
      writeCache(cacheKey, json.data);
      return json.data;
    } catch (err) {
      const cached = readCache(cacheKey);
      if (cached) return cached;
      throw err;
    }
  },

  async getSpices(search = "", page = 1, limit = 8) {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    params.append("page", String(page));
    params.append("limit", String(limit));

    const queryKey = `spices:${params.toString()}`;

    try {
      const json = await fetchApi(`/spices?${params.toString()}`);
      const result = {
        data: json.data,
        pagination: json.pagination ?? {
          page,
          limit,
          totalItems: json.data.length,
          totalPages: 1,
        },
      };
      writeCache(queryKey, result);
      json.data.forEach((item) => writeCache(`spice:${item.id}`, item));
      return result;
    } catch (err) {
      const cached = readCache(queryKey);
      if (cached) return { ...cached, fromCache: true };
      throw err;
    }
  },

  async getSpiceById(id) {
    const cacheKey = `spice:${id}`;
    try {
      const json = await fetchApi(`/spices/${id}`);
      writeCache(cacheKey, json.data);
      return json.data;
    } catch (err) {
      const cached = readCache(cacheKey);
      if (cached) return cached;
      throw err;
    }
  },

  async getAllDrinks() {
    const cacheKey = "drinks:all";
    try {
      const json = await fetchApi("/drinks");
      writeCache(cacheKey, json.data);
      json.data.forEach((item) => writeCache(`drink:${item.id}`, item));
      return json.data;
    } catch (err) {
      const cached = readCache(cacheKey);
      if (cached) return cached;
      throw err;
    }
  },

  async getAllSpices() {
    const cacheKey = "spices:all";
    try {
      const json = await fetchApi("/spices");
      writeCache(cacheKey, json.data);
      json.data.forEach((item) => writeCache(`spice:${item.id}`, item));
      return json.data;
    } catch (err) {
      const cached = readCache(cacheKey);
      if (cached) return cached;
      throw err;
    }
  },

  async createDrink(payload) {
    if (!navigator.onLine) {
      throw createOfflineError();
    }

    let response;
    try {
      response = await fetch(`${API_BASE_URL}/drinks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      if (!navigator.onLine) {
        throw createOfflineError();
      }
      throw new Error(
        `Tidak dapat menjangkau server (${API_BASE_URL}). Pastikan backend aktif.`
      );
    }

    let json = null;
    try {
      json = await response.json();
    } catch {
      // Abaikan jika respons bukan JSON
    }

    if (!response.ok || !json?.success) {
      throw new Error(
        json?.message || `Gagal menyimpan minuman (HTTP ${response.status})`
      );
    }

    return json.data;
  },

  clearApiCache() {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Abaikan
    }
  },

  getCachedEntryCount() {
    try {
      return Object.keys(localStorage).filter((key) =>
        key.startsWith(CACHE_PREFIX)
      ).length;
    } catch {
      return 0;
    }
  },
};