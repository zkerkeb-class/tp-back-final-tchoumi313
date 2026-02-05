import express from "express";
import "./connect.js";
import pokemon from "./schema/pokemon.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/pokemons", async (req, res) => {
  try {
    const pokemons = await pokemon.find();
    res.json(pokemons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/pokemons/:id", async (req, res) => {
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
});

app.delete("/pokemons/:id", async (req, res) => {
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
});

app.put("/pokemons/:id", express.json(), async (req, res) => {
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
});

app.post("/pokemons", express.json(), async (req, res) => {
  try {
    const newPokemon = new pokemon(req.body);
    await newPokemon.save();
    res
      .status(201)
      .json({ message: "Pokemon created successfully", pokemon: newPokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// My Addons:
//Get by english Name
app.get("/pokemonbyname/:name", async (req, res) => {
  const pokemonName = req.params.name;
  const poke = await pokemon.findOne({ "name.english": pokemonName });
  if (poke) {
    res.json(poke);
  } else {
    res.status(404).json({ error: "Pokemon not found" });
  }
});

//Delete in a batch
app.delete("/pokemons", express.json(), async (req, res) => {
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
});
//Duplicate a Pokemon by ID
//pokemons = await pokemon.find();
//console.log('pokemons length:', pokemons.length);
const getNextId = async () => {
  const lastPokemon = await pokemon.findOne().sort({ id: -1 });

  return lastPokemon ? lastPokemon.id + 1 : 1;
};

app.post("/pokemons/:id", async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const poke = await pokemon.findOne({ id: pokeId });
    if (poke) {
      const duplicatedPoke = new pokemon({
        ...poke.toObject(),
        _id: undefined,
        id: await getNextId(),
      });
      duplicatedPoke.name.english = duplicatedPoke.name.english + " Copy";
      duplicatedPoke.name.french = duplicatedPoke.name.french + " Copie";
      await duplicatedPoke.save();
      res
        .status(201)
        .json({
          message: "Pokemon duplicated successfully",
          pokemon: duplicatedPoke,
        });
    } else {
      res.status(404).json({ error: "Pokemon not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/pokemons-comparetwoormore", express.json(), async (req, res) => {
  try {
    const idsToCompare = req.body.ids;
    console.log("IDs to compare:", idsToCompare);
    if (idsToCompare.length > 1) {
      const pokemonsToCompare = await pokemon.find({
        id: { $in: idsToCompare },
      });
      if (pokemonsToCompare.length > 0) {
        res.json(pokemonsToCompare);
      } else {
        res.status(404).json({ error: "No Pokemons found for comparison" });
      }
    } else {
      res
        .status(400)
        .json({ error: "Please select at least 2 Pokemons for comparison" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

console.log("Server is set up. Ready to start listening on a port.");

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
