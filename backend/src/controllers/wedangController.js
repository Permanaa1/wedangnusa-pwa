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