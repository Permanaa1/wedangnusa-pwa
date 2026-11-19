const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function fetchJson(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Request gagal (${response.status})`);
  }
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.message || "Gagal memuat data");
  }
  return json.data;
}

export const WedangApi = {
  baseUrl: API_BASE_URL,

  getDrinks: (search = "", serving = "Semua") => {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    if (serving && serving !== "Semua") params.append("serving", serving);
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchJson(`/drinks${query}`);
  },

  getDrinkById: (id) => fetchJson(`/drinks/${id}`),

  getSpices: (search = "") => {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchJson(`/spices${query}`);
  },

  getSpiceById: (id) => fetchJson(`/spices/${id}`),
};