import express from "express";
import { body } from "express-validator";
import {
  declareStage,
  getStagesForStudent,
  listAllStages,
  validateStage,
  refuseStage,
} from "../controllers/stagesController.js";

const router = express.Router();

// ✅ Admin : tous les stages
router.get("/", listAllStages);

// ✅ Étudiant : stages par email
router.get("/student", getStagesForStudent);

// ✅ Déclaration
router.post(
  "/",
  [
    body("nom").notEmpty().withMessage("nom requis"),
    body("email").isEmail().withMessage("email invalide"),
    body("entreprise").notEmpty().withMessage("entreprise requise"),
    body("sujet").notEmpty().withMessage("sujet requis"),
  ],
  declareStage
);

// ✅ Actions admin
router.put("/:id/validate", validateStage);
router.put("/:id/refuse", refuseStage);

export default router;
