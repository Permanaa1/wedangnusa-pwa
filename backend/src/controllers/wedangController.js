import { supabase } from "../config/supabase.js";

// GET /api/drinks (Mendukung ?search=&serving=&page=&limit=)
export const getAllDrinks = async (req, res) => {
  try {
    const { search, serving, page, limit } = req.query;
    let query = supabase
      .from("drinks")
      .select("*", { count: "exact" })
      .order("id", { ascending: true });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }
    if (serving && serving !== "Semua") {
      query = query.ilike("serving_type", `%${serving}%`);
    }

    let pagination = null;
    if (page !== undefined) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 6));
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const totalItems = count ?? data.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / limitNum));

      pagination = {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages,
      };

      return res.status(200).json({
        success: true,
        count: data.length,
        pagination,
        data,
      });
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data minuman",
      error: err.message,
    });
  }
};

// GET /api/drinks/:id
export const getDrinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("drinks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Minuman tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};


// POST /api/drinks (Tambah / usulkan minuman tradisional baru)
export const createDrink = async (req, res) => {
  try {
    const {
      name,
      origin,
      serving_type,
      category,
      image_url,
      description,
      ingredients,
      steps,
      benefits,
    } = req.body;

    if (!name || !origin || !description) {
      return res.status(400).json({
        success: false,
        message: "Nama minuman, asal daerah, dan deskripsi wajib diisi",
      });
    }

    const toArray = (val, fallback) => {
      if (Array.isArray(val)) {
        const cleaned = val.map((s) => String(s).trim()).filter(Boolean);
        return cleaned.length ? cleaned : fallback;
      }
      if (typeof val === "string") {
        const cleaned = val
          .split(/\r?\n|,/)
          .map((s) => s.trim())
          .filter(Boolean);
        return cleaned.length ? cleaned : fallback;
      }
      return fallback;
    };

    const payload = {
      name: String(name).trim(),
      origin: String(origin).trim(),
      serving_type: String(serving_type || "Hangat").trim(),
      category: String(category || "Minuman Tradisional").trim(),
      image_url:
        String(image_url || "").trim() ||
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
      description: String(description).trim(),
      ingredients: toArray(ingredients, ["Bahan rempah tradisional sesuai selera"]),
      steps: toArray(steps, [
        "Rebus bahan bersama air bersih hingga mendidih dan harum.",
        "Saring lalu sajikan.",
      ]),
      benefits: toArray(benefits, ["Menghangatkan dan menyegarkan tubuh"]),
    };

    const { data, error } = await supabase
      .from("drinks")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Supabase Error (${error.code || "DB"}): ${error.message}`,
        details: error.details || null,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Minuman tradisional berhasil ditambahkan",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err?.message || "Gagal menyimpan data minuman baru"}`,
    });
  }
};

// GET /api/spices (Mendukung ?search=&page=&limit=)
export const getAllSpices = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    let query = supabase
      .from("spices")
      .select("*", { count: "exact" })
      .order("id", { ascending: true });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (page !== undefined) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 8));
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const totalItems = count ?? data.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / limitNum));

      return res.status(200).json({
        success: true,
        count: data.length,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalItems,
          totalPages,
        },
        data,
      });
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data rempah",
      error: err.message,
    });
  }
};

// GET /api/spices/:id
export const getSpiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("spices")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Bahan rempah tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};
