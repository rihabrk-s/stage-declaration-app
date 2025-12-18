import { validationResult } from "express-validator";
import {
  createStage,
  getStagesByEmail,
  getAllStages,
  updateStageStatus,
  getStageById,
} from "../models/Stage.js";

import { findOrCreateUser } from "../models/User.js";

// POST /api/stages
export const declareStage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { nom, prenom, email, entreprise, sujet, date_debut, date_fin } = req.body;

    const user = await findOrCreateUser({
      nom: `${nom} ${prenom || ""}`.trim(),
      email,
      role: "etudiant",
    });

    const stage = await createStage({
      id_etudiant: user.id,
      entreprise,
      sujet,
      date_debut: date_debut || null,
      date_fin: date_fin || null,
    });

    return res.status(201).json({ stage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur lors de la déclaration" });
  }
};

// GET /api/stages (admin) OU /api/stages?email=...
export const listAllStages = async (req, res) => {
  try {
    if (req.query.email) {
      const stages = await getStagesByEmail(req.query.email);
      return res.json({ stages });
    }
    const stages = await getAllStages();
    return res.json({ stages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /api/stages/student?email=...
export const getStagesForStudent = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "email requis" });

    const stages = await getStagesByEmail(email);
    return res.json({ stages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /api/stages/:id/validate
export const validateStage = async (req, res) => {
  try {
    const existing = await getStageById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Stage introuvable" });

    const stage = await updateStageStatus(req.params.id, "valide");
    return res.json({ stage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /api/stages/:id/refuse
export const refuseStage = async (req, res) => {
  try {
    const existing = await getStageById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Stage introuvable" });

    const stage = await updateStageStatus(req.params.id, "refuse");
    return res.json({ stage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
