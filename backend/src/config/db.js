import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.DB_HOST,   // 127.0.0.1
  port: process.env.DB_PORT,   // 3306
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err);
  } else {
    console.log("Connexion MySQL réussie !");
  }
});

export default connection;
