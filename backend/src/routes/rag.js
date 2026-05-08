// backend/src/routes/rag.js
import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Chemin vers le dossier racine du projet (devoir6_integrated)
const RAG_DIR = path.resolve(__dirname, "../../..");
const PYTHON = "python";

router.post("/ask", (req, res) => {
  const { question, top_k = 4 } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "Le champ 'question' est requis." });
  }

  const args = [
    path.join(RAG_DIR, "rag", "pipeline.py"),
    "--question", question.trim(),
    "--top_k", String(top_k),
    "--json",
  ];

  let stdout = "";
  let stderr = "";
  let responded = false;

  const proc = spawn(PYTHON, args, {
    cwd: RAG_DIR,
    env: { ...process.env },
  });

  proc.stdout.on("data", (d) => { stdout += d.toString(); });
  proc.stderr.on("data", (d) => { stderr += d.toString(); });

  proc.on("close", (code) => {
    if (responded) return;
    responded = true;

    if (code !== 0) {
      console.error("RAG stderr:", stderr.slice(-300));
      return res.status(500).json({
        error: "Erreur pipeline RAG",
        detail: stderr.slice(-300),
      });
    }

    // Extraire le JSON depuis stdout (ignore les logs INFO/WARNING)
    const lines = stdout.split("\n");
    const jsonStart = stdout.indexOf("{");
    const jsonEnd = stdout.lastIndexOf("}");
    const jsonStr = jsonStart !== -1 ? stdout.slice(jsonStart, jsonEnd + 1) : null;

    if (jsonStr) {
      try {
        const result = JSON.parse(jsonStr);
        return res.json({
          answer: result.answer || "Aucune réponse.",
          chunks: result.chunks || [],
          mode: result.mode || "rag",
          question: result.question || question,
        });
      } catch {}
    }

    // Fallback : retourner le stdout brut comme réponse
    return res.json({
      answer: stdout.trim() || "Aucune réponse générée.",
      chunks: [],
      mode: "rag",
      question,
    });
  });

  proc.on("error", (err) => {
    if (responded) return;
    responded = true;
    return res.status(500).json({
      error: "Impossible de lancer Python",
      detail: err.message,
    });
  });
});

router.get("/health", (_req, res) => {
  res.json({ status: "ok", pipeline: "rag", python: PYTHON });
});

export default router;