import pokemon from "../schema/pokemon.js";

export const normalizeTeamName = (name = "") => {
  return name.trim().toLowerCase();
};

export const getNextId = async () => {
  const lastPokemon = await pokemon.findOne().sort({ id: -1 });
  return lastPokemon ? lastPokemon.id + 1 : 1;
};

export const parsePaginationQuery = (query) => {
  const page = Math.max(parseInt(query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || "20", 10), 1), 100);
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

export const parseIds = (idsParam) => {
  if (Array.isArray(idsParam)) {
    return idsParam.map((id) => parseInt(id, 10));
  }
  
  return (idsParam || "")
    .split(",")
    .map((id) => parseInt(id, 10))
    .filter((id) => !Number.isNaN(id));
};
