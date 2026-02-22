export const CONFIG = {
  PORT: process.env.PORT || 3000,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  UPLOAD_DIR: "assets/uploads",
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  SEARCH_LIMIT: 10,
  JWT_SECRET: process.env.JWT_SECRET || "fallback_jwt_secret",
  SESSION_SECRET: process.env.SESSION_SECRET || "fallback_session_secret",
};
