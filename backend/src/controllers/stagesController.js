// backend/src/controllers/stagesController.js
import Stage from "../models/Stage.js";

// ✅ Déclarer un stage (statut par défaut = "en_attente")
export const declareStage = async (req, res) => {
  try {
    const { nom, prenom, email, entreprise, sujet, date_debut, date_fin } = req.body;

    const stage = await Stage.create({
      nom,
      prenom,
      email,
      entreprise,
      sujet,
      date_debut: date_debut || null,
      date_fin: date_fin || null,
      statut: "en_attente",
    });

    return res.status(201).json({ stage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur lors de la déclaration" });
  }
};

// ✅ Admin : lister tous les stages
export const listAllStages = async (req, res) => {
  try {
    const stages = await Stage.find().sort({ createdAt: -1 });
    return res.json({ stages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Étudiant : récupérer ses stages par email
// Supporte 2 formes :
// - GET /api/stages?email=...
// - GET /api/stages/student?email=...
export const getStagesForStudent = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "email requis" });

    const stages = await Stage.find({ email }).sort({ createdAt: -1 });
    return res.json({ stages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Admin : valider un stage
export const validateStage = async (req, res) => {
  try {
    const { id } = req.params;

    const stage = await Stage.findByIdAndUpdate(
      id,
      { statut: "valide" },
      { new: true }
    );

    if (!stage) return res.status(404).json({ message: "Stage introuvable" });

    return res.json({ stage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Admin : refuser un stage
export const refuseStage = async (req, res) => {
  try {
    const { id } = req.params;

    const stage = await Stage.findByIdAndUpdate(
      id,
      { statut: "refuse" },
      { new: true }
    );

    if (!stage) return res.status(404).json({ message: "Stage introuvable" });

    return res.json({ stage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
