import { validationResult } from "express-validator";
import { findOrCreateUser } from "../models/User.js";
import {
  createStage,
  getStagesByEmail,
  getAllStages,
  updateStageStatus,
  getStageById
} from "../models/Stage.js";

/**
 * Déclarer un stage : si user n'existe pas, le créer, puis créer le stage.
 * body: { nom, email, entreprise, sujet, date_debut, date_fin }
 */
export const declareStage = async (req, res) => {
  console.log("Requête reçue :", req.body); // <-- pour vérifier ce qui arrive

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Erreurs de validation :", errors.array()); // <-- pour voir les erreurs de validation
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nom, email, entreprise, sujet, date_debut, date_fin } = req.body;
    console.log("Données extraites :", { nom, email, entreprise, sujet, date_debut, date_fin }); // <-- pour vérifier ce qui sera utilisé

    // findOrCreate user
    const user = await findOrCreateUser({ nom, email, role: "etudiant" });
    console.log("Utilisateur trouvé/créé :", user);

    const stage = await createStage({
      id_etudiant: user.id,
      entreprise,
      sujet,
      date_debut: date_debut || null,
      date_fin: date_fin || null
    });
    console.log("Stage créé :", stage);

    res.status(201).json({ stage });
  } catch (err) {
    console.error("Erreur catch :", err);
    res.status(500).json({ error: "Erreur serveur lors de la déclaration" });
  }
};

export const getStagesForStudent = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "email requis" });

    const stages = await getStagesByEmail(email);
    res.json({ stages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const listAllStages = async (req, res) => {
  try {
    const stages = await getAllStages();
    res.json({ stages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const validateStage = async (req, res) => {
  try {
    const id = req.params.id;
    const stage = await getStageById(id);
    if (!stage) return res.status(404).json({ error: "Stage non trouvé" });

    const updated = await updateStageStatus(id, "validé");
    res.json({ stage: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const refuseStage = async (req, res) => {
  try {
    const id = req.params.id;
    const stage = await getStageById(id);
    if (!stage) return res.status(404).json({ error: "Stage non trouvé" });

    const updated = await updateStageStatus(id, "refusé");
    res.json({ stage: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
