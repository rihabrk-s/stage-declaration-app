// backend/src/controllers/stagesController.js
import { validationResult } from "express-validator";

import {
  createStage,
  getStagesByEmail,
  getAllStages,
  updateStageStatus,
  getStageById,
} from "../models/stageModel.js";

import { findOrCreateUser } from "../models/userModel.js";

/**
 * POST /api/stages
 * Body: { nom, prenom, email, entreprise, sujet, date_debut, date_fin }
 */
export const declareStage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation error", errors: errors.array() });
  }

  try {
    const { nom, prenom, email, entreprise, sujet, date_debut, date_fin } = req.body;

    // ✅ Trouver ou créer l'utilisateur étudiant
    const user = await findOrCreateUser({
      nom: `${nom} ${prenom || ""}`.trim(),
      email,
      role: "etudiant",
    });

    // ✅ Créer le stage lié à l'étudiant
    const stage = await createStage({
      id_etudiant: user.id,
      entreprise,
      sujet,
      date_debut: date_debut || null,
      date_fin: date_fin || null,
    });

    return res.status(201).json({ stage });
  } catch (err) {
    console.error("declareStage error:", err);
    return res.status(500).json({ message: "Erreur serveur lors de la déclaration" });
  }
};

/**
 * GET /api/stages
 * - Admin: liste tous les stages (si pas de query email)
 * - Étudiant: si ?email=... => renvoie ses stages
 */
export const listAllStages = async (req, res) => {
  try {
    // ✅ IMPORTANT: compatibilité avec ton front StudentStatus
    // StudentStatus appelle GET /api/stages?email=...
    if (req.query.email) {
      return getStagesForStudent(req, res);
    }

    const stages = await getAllStages();
    return res.json({ stages });
  } catch (err) {
    console.error("listAllStages error:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * GET /api/stages/student?email=...
 * ou GET /api/stages?email=...
 */
export const getStagesForStudent = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "email requis" });

    const stages = await getStagesByEmail(email);
    return res.json({ stages });
  } catch (err) {
    console.error("getStagesForStudent error:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * PUT /api/stages/:id/validate
 */
export const validateStage = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getStageById(id);
    if (!existing) return res.status(404).json({ message: "Stage introuvable" });

    const stage = await updateStageStatus(id, "valide");
    return res.json({ stage });
  } catch (err) {
    console.error("validateStage error:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * PUT /api/stages/:id/refuse
 */
export const refuseStage = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getStageById(id);
    if (!existing) return res.status(404).json({ message: "Stage introuvable" });

    const stage = await updateStageStatus(id, "refuse");
    return res.json({ stage });
  } catch (err) {
    console.error("refuseStage error:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
