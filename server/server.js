import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
import { setServers } from "dns";
import cors from "cors";
import connectDB from "./config/db.js";
import configureSession from "./config/session.js";
import authRoutes from "./routes/auth.routes.js";
import dealRoutes from "./routes/deal.routes.js";
import businessRoutes from "./routes/business.routes.js";
import recipeRouter from "./routes/recipe.routes.js";
import itemRouter from "./routes/item.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

setServers(["8.8.8.8", "8.8.4.4"]);

app.use(cors({ origin: `http://localhost:5173`, credentials: true }));

app.use(express.json());
app.use(configureSession());
app.use("/auth", authRoutes);
app.use("/deal", dealRoutes);
app.use("/business", businessRoutes);
app.use("/recipe", recipeRouter);
app.use("/items", itemRouter);
app.get("/", (req, res) => res.send("Auth server running"));

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
