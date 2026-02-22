import express from "express";
import pokemonRoutes from "./pokemonRoutes.js";
import teamRoutes from "./teamRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import authRoutes from "./authRoutes.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

router.use("/auth", authRoutes);


router.use("/pokemons", requireAuth, pokemonRoutes);
router.use("/teams", requireAuth, teamRoutes);
router.use("/upload", requireAuth, uploadRoutes);

export default router;
