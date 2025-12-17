import dotenv from "dotenv";
dotenv.config(); // Doit être en tout début

console.log("DB_USER =", process.env.DB_USER);
console.log("DB_PASSWORD =", process.env.DB_PASSWORD);


import express from "express";
import cors from "cors";
import stagesRoutes from "./src/routes/stages.js";
import usersRoutes from "./src/routes/users.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stages", stagesRoutes);
app.use("/api/users", usersRoutes);

// Healthcheck
app.get("/", (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || "dev" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
