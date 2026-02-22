import express from "express";
import {
  listPokemons,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon,
  deleteMultiplePokemons,
  duplicatePokemon,
  compareTwoPokemons,
  searchPokemon,
} from "../controllers/pokemonController.js";

const router = express.Router();

router.get("/search", searchPokemon);
router.get("/comparetwo", compareTwoPokemons);
router.get("/", listPokemons);
router.get("/:id", getPokemonById);
router.post("/", createPokemon);
router.put("/:id", updatePokemon);
router.delete("/:id", deletePokemon);
router.delete("/", deleteMultiplePokemons);
router.post("/:id", duplicatePokemon);

export default router;
