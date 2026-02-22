import team from "../schema/team.js";
import pokemon from "../schema/pokemon.js";
import { normalizeTeamName, parseIds } from "../utils/helpers.js";

export const createTeam = async (req, res) => {
  try {
    const { name, pokemonIds } = req.body || {};
    const trimmedName = (name || "").trim();
    
    if (!trimmedName) {
      return res.status(400).json({ error: "Team name is required" });
    }

    const ids = Array.isArray(pokemonIds)
      ? pokemonIds
          .map((id) => parseInt(id, 10))
          .filter((id) => !Number.isNaN(id))
      : [];

    const nameLower = normalizeTeamName(trimmedName);
    const exists = await team.findOne({ nameLower });
    
    if (exists) {
      return res.status(409).json({ error: "Team name already exists" });
    }

    const created = await team.create({
      name: trimmedName,
      nameLower,
      pokemonIds: ids,
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listTeams = async (req, res) => {
  try {
    const teams = await team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTeamByName = async (req, res) => {
  try {
    const nameLower = normalizeTeamName(req.params.name);
    const found = await team.findOne({ nameLower });
    
    if (!found) {
      return res.status(404).json({ error: "Team not found" });
    }

    const pokemons = await pokemon.find({ id: { $in: found.pokemonIds } });
    const pokemonById = new Map(pokemons.map((p) => [p.id, p]));
    const ordered = found.pokemonIds
      .map((id) => pokemonById.get(id))
      .filter(Boolean);

    res.json({
      team: found,
      pokemons: ordered,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const nameLower = normalizeTeamName(req.params.name);
    const ids = Array.isArray(req.body?.pokemonIds)
      ? req.body.pokemonIds
          .map((id) => parseInt(id, 10))
          .filter((id) => !Number.isNaN(id))
      : [];

    const updated = await team.findOneAndUpdate(
      { nameLower },
      { $set: { pokemonIds: ids } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const nameLower = normalizeTeamName(req.params.name);
    const result = await team.deleteOne({ nameLower });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
