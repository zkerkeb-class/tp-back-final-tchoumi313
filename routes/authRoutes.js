import express from "express";
import passport from "../config/passport.js";
import { googleCallback, getMe, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=auth_failed` }),
  googleCallback
);

router.get("/me", requireAuth, getMe);

router.post("/logout", logout);

export default router;
