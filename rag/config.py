"""
config.py — Configuration centralisée du pipeline RAG
Devoir 6 — Pipeline RAG : Retrieval Augmented Generation

Tous les paramètres sont surchargeable via variables d'environnement
ou en modifiant ce fichier. Aucun paramètre "magique" dans le code.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ── Chemins ───────────────────────────────────────────────────────────────────
BASE_DIR      = Path(__file__).resolve().parent.parent
DOCUMENTS_DIR = BASE_DIR / "documents"
CHROMA_DIR    = BASE_DIR / "chroma_db"

# ── Chunking ──────────────────────────────────────────────────────────────────
CHUNK_SIZE    = int(os.getenv("CHUNK_SIZE", 512))      # taille d'un chunk en tokens/chars
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 64))    # chevauchement entre chunks

# ── Retrieval ─────────────────────────────────────────────────────────────────
TOP_K = int(os.getenv("TOP_K", 4))                     # nombre de chunks récupérés

# ── Embedding ─────────────────────────────────────────────────────────────────
# Modèle SentenceTransformers — fonctionne sans clé API
EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# ── LLM ───────────────────────────────────────────────────────────────────────
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
LLM_MODEL      = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
LLM_MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", 800))
LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", 0.2))

# ── Prompt template RAG ───────────────────────────────────────────────────────
RAG_PROMPT_TEMPLATE = """Tu es un assistant expert en stages et emplois étudiants. \
Réponds à la question de l'utilisateur en te basant uniquement sur le contexte fourni. \
Si la réponse n'est pas dans le contexte, dis-le clairement.

Contexte :
{context}

Question : {question}

Réponse :"""

# ── Prompt template sans RAG (baseline) ──────────────────────────────────────
BASELINE_PROMPT_TEMPLATE = """Tu es un assistant expert en stages et emplois étudiants.
Réponds à la question suivante du mieux possible.

Question : {question}

Réponse :"""