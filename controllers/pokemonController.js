import pokemon from "../schema/pokemon.js";
import { getNextId, parsePaginationQuery, parseIds } from "../utils/helpers.js";

export const listPokemons = async (req, res) => {
  try {
    const { page, limit, skip } = parsePaginationQuery(req.query);
    
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const [items, total] = await Promise.all([
      pokemon.find(filter).skip(skip).limit(limit),
      pokemon.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPokemonById = async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const poke = await pokemon.findOne({ id: pokeId });
    
    if (poke) {
      res.json(poke);
    } else {
      res.status(404).json({ error: "Pokemon not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPokemon = async (req, res) => {
  try {
    const pokemonData = req.body;
    if (!pokemonData.id) {
      pokemonData.id = await getNextId();
    }
    
    const newPokemon = new pokemon(pokemonData);
    await newPokemon.save();
    
    res.status(201).json({
      message: "Pokemon created successfully",
      pokemon: newPokemon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePokemon = async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const updateData = req.body;
    
    const result = await pokemon.updateOne(
      { id: pokeId },
      { $set: updateData }
    );
    
    if (result.matchedCount > 0) {
      res.json({ message: "Pokemon updated successfully" });
    } else {
      res.status(404).json({ error: "Pokemon not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePokemon = async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const result = await pokemon.deleteOne({ id: pokeId });
    
    if (result.deletedCount > 0) {
      res.json({ message: "Pokemon deleted successfully" });
    } else {
      res.status(404).json({ error: "Pokemon not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMultiplePokemons = async (req, res) => {
  try {
    const idsToDelete = req.body.ids;
    const result = await pokemon.deleteMany({ id: { $in: idsToDelete } });
    
    res.json({
      message: `${result.deletedCount} Pokemons deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const duplicatePokemon = async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const poke = await pokemon.findOne({ id: pokeId });
    
    if (!poke) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    const duplicatedPoke = new pokemon({
      ...poke.toObject(),
      _id: undefined,
      id: await getNextId(),
    });
    
    duplicatedPoke.name.english = duplicatedPoke.name.english + " Copy";
    duplicatedPoke.name.french = duplicatedPoke.name.french + " Copie";
    await duplicatedPoke.save();
    
    res.status(201).json({
      message: "Pokemon duplicated successfully",
      pokemon: duplicatedPoke,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const compareTwoPokemons = async (req, res) => {
  try {
    const idsToCompare = parseIds(req.query.ids);

    if (idsToCompare.length < 2) {
      return res.status(400).json({
        error: "Please select at least 2 Pokemons for comparison",
      });
    }

    const pokemonsToCompare = await pokemon.find({
      id: { $in: idsToCompare },
    });
    
    if (pokemonsToCompare.length === 0) {
      return res.status(404).json({
        error: "No Pokemons found for comparison",
      });
    }

    res.json(pokemonsToCompare);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchPokemon = async (req, res) => {
  try {
    const query = req.query.q || "";
    
    if (!query.trim()) {
      return res.json([]);
    }

    const results = await pokemon
      .find({
        $or: [
          { "name.english": { $regex: query, $options: "i" } },
          { "name.french": { $regex: query, $options: "i" } },
          { id: isNaN(query) ? -1 : parseInt(query, 10) },
        ],
      })
      .limit(10);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
