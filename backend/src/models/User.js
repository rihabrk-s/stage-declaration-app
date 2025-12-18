import db from "../config/db.js";

export const findOrCreateUser = async ({ nom, email, role = "etudiant" }) => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length) {
      return rows[0];
    }

    // Créer l'utilisateur
    const [res] = await db.query(
      "INSERT INTO users (nom, email, role) VALUES (?, ?, ?)",
      [nom, email, role]
    );

    // Récupérer l'utilisateur créé
    const [created] = await db.query("SELECT * FROM users WHERE id = ?", [res.insertId]);
    return created[0];
  } catch (err) {
    console.error("Erreur findOrCreateUser:", err);
    throw err;
  }
};

export const findUserById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  } catch (err) {
    console.error("Erreur findUserById:", err);
    throw err;
  }
};
