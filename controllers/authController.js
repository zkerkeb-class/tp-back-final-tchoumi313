import jwt from "jsonwebtoken";
import { CONFIG } from "../config/constants.js";

export const googleCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    CONFIG.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Redirect back to the frontend with the token
  res.redirect(`${CONFIG.FRONTEND_URL}/auth/callback?token=${token}`);
};

export const getMe = (req, res) => {
  res.json(req.user);
};

export const logout = (req, res) => {
  req.logout?.(() => {});
  res.json({ message: "Logged out" });
};
