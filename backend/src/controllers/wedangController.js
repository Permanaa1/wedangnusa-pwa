import { supabase } from "../config/supabase.js";

// GET /api/drinks (Daftar semua minuman + dukungan filter search & serving_type)
export const getAllDrinks = async (req, res) => {
  try {
    const { search, serving } = req.query;
    let query = supabase.from("drinks").select("*").order("id", { ascending: true });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }
    if (serving && serving !== "Semua") {
      query = query.ilike("serving_type", `%${serving}%`);
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

// GET /api/drinks/:id (Detail minuman berdasarkan ID)
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

// GET /api/spices (Daftar semua rempah + dukungan filter search)
export const getAllSpices = async (req, res) => {
  try {
    const { search } = req.query;
    let query = supabase.from("spices").select("*").order("id", { ascending: true });

    if (search) {
      query = query.ilike("name", `%${search}%`);
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

// GET /api/spices/:id (Detail rempah berdasarkan ID)
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