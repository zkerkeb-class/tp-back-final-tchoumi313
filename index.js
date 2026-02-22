import "dotenv/config";
import express from "express";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import "./connect.js";
import passport from "./config/passport.js";
import { CONFIG } from "./config/constants.js";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "assets")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(corsMiddleware);

app.use(
  session({
    secret: CONFIG.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api", apiRoutes);


app.use(notFoundHandler);
app.use(errorHandler);


const PORT = CONFIG.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Frontend URL: ${CONFIG.FRONTEND_URL}`);
});
