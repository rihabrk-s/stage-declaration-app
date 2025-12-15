import express from "express";
import { upsertUser } from "../controllers/usersController.js";

const router = express.Router();

/**
 * POST /api/users
 * body: { nom, email, role? }
 * crée ou retourne user existant
 */
router.post("/", upsertUser);

export default router;
