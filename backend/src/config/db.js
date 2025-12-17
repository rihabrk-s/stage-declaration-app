import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config(); // Assure que process.env est chargé

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect(err => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err);
    process.exit(1); // Arrête le serveur si MySQL n'est pas joignable
  } else {
    console.log("Connecté à la base MySQL !");
  }
});

export default db;
