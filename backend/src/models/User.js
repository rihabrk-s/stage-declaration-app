import db from "../config/db.js";

export const findOrCreateUser = async ({ nom, email, role = "etudiant" }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length) {
      await conn.commit();
      return rows[0];
    }

    const [res] = await conn.query(
      "INSERT INTO users (nom, email, role) VALUES (?, ?, ?)",
      [nom, email, role]
    );
    const [created] = await conn.query("SELECT * FROM users WHERE id = ?", [res.insertId]);
    await conn.commit();
    return created[0];
  } finally {
    conn.release();
  }
};

export const findUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};
