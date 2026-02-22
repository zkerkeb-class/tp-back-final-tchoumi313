import { CONFIG } from "../config/constants.js";

export const corsMiddleware = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CONFIG.FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  
  next();
};
