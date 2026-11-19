import express from "express";
import {
  getAllDrinks,
  getDrinkById,
  getAllSpices,
  getSpiceById,
} from "../controllers/wedangController.js";

const router = express.Router();

router.get("/drinks", getAllDrinks);
router.get("/drinks/:id", getDrinkById);
router.get("/spices", getAllSpices);
router.get("/spices/:id", getSpiceById);

export default router;