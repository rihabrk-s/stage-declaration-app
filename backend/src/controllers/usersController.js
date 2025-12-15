import { findOrCreateUser } from "../models/User.js";

/**
 * Endpoint pour créer / retrouver un user simple (utilisé côté frontend lorsqu'on déclare)
 * body: { nom, email, role? }
 */
export const upsertUser = async (req, res) => {
  try {
    const { nom, email, role } = req.body;
    if (!nom || !email) return res.status(400).json({ error: "nom et email requis" });

    const user = await findOrCreateUser({ nom, email, role });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
