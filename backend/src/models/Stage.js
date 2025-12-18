import db from "../config/db.js";

export const createStage = async ({ id_etudiant, entreprise, sujet, date_debut, date_fin }) => {
  const [result] = await db.query(
    `INSERT INTO stages (id_etudiant, entreprise, sujet, date_debut, date_fin, statut)
     VALUES (?, ?, ?, ?, ?, 'en_attente')`,
    [id_etudiant, entreprise, sujet, date_debut, date_fin]
  );
  const [rows] = await db.query("SELECT * FROM stages WHERE id = ?", [result.insertId]);
  return rows[0];
};

export const getStagesByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT s.*
     FROM stages s
     JOIN users u ON u.id = s.id_etudiant
     WHERE u.email = ?
     ORDER BY s.id DESC`,
    [email]
  );
  return rows;
};

export const getAllStages = async () => {
  const [rows] = await db.query(
    `SELECT s.id, s.entreprise, s.sujet, s.date_debut, s.date_fin, s.statut, u.nom, u.email
     FROM stages s
     LEFT JOIN users u ON u.id = s.id_etudiant
     ORDER BY s.id DESC`
  );
  return rows;
};

export const updateStageStatus = async (id, statut) => {
  await db.query("UPDATE stages SET statut = ? WHERE id = ?", [statut, id]);
  const [rows] = await db.query("SELECT * FROM stages WHERE id = ?", [id]);
  return rows[0];
};

export const getStageById = async (id) => {
  const [rows] = await db.query("SELECT * FROM stages WHERE id = ?", [id]);
  return rows[0];
};
