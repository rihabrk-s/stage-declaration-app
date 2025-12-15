import express from "express";
import { body } from "express-validator";
import {
  declareStage,
  getStagesForStudent,
  listAllStages,
  validateStage,
  refuseStage
} from "../controllers/stagesController.js";

const router = express.Router();

/**
 * POST /api/stages
 * Déclarer un stage (et créer user si besoin)
 */
router.post(
  "/",
  [
    body("nom").notEmpty().withMessage("nom requis"),
    body("email").isEmail().withMessage("email invalide"),
    body("entreprise").notEmpty().withMessage("entreprise requise"),
    body("sujet").notEmpty().withMessage("sujet requis")
  ],
  declareStage
);

/**
 * GET /api/stages?email=...
 * Récupérer les stages d'un étudiant via son email
 */
router.get("/", getStagesForStudent);

/**
 * GET /api/stages/all
 * Liste complète pour l'admin
 */
router.get("/all", listAllStages);

/**
 * PUT /api/stages/:id/validate
 */
router.put("/:id/validate", validateStage);

/**
 * PUT /api/stages/:id/refuse
 */
router.put("/:id/refuse", refuseStage);

export default router;
