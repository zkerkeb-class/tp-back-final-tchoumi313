import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameLower: { type: String, required: true, unique: true, index: true },
    pokemonIds: { type: [Number], required: true, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("team", teamSchema);
