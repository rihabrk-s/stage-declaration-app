import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test de connexion (utile en dev)
db.getConnection()
  .then((conn) => {
    console.log("Connecté à la base MySQL !");
    conn.release();
  })
  .catch((err) => {
    console.error("Erreur de connexion à MySQL :", err);
    process.exit(1);
  });

export default db;
