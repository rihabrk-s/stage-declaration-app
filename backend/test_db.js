import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "127.0.0.1",  
  port: 3306,
  user: "root",        
  password: "password123@", 
  database: "stage_db",   
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur test MySQL :", err);
  } else {
    console.log("Connexion MySQL réussie !");
  }
  connection.end();
});
