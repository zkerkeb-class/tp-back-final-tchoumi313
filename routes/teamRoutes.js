import express from "express";
import {
  createTeam,
  listTeams,
  getTeamByName,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/", createTeam);
router.get("/", listTeams);
router.get("/:name", getTeamByName);
router.put("/:name", updateTeam);
router.delete("/:name", deleteTeam);

export default router;
