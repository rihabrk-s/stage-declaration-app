# Pipeline RAG — Devoir 6

Pipeline Retrieval Augmented Generation (RAG) complet intégré à la plateforme de stages.

## Architecture

```
Documents sources (TXT / PDF / HTML / DOCX)
    ↓
Parsing & Chunking (512 chars, overlap 64)
    ↓
Embedding — SentenceTransformers (multilingue)
    ↓
Indexation — ChromaDB (similarité cosinus)
    ↓
[Requête utilisateur]
    ↓
Retrieval — Top-K chunks similaires
    ↓
Prompt enrichi = Contexte + Question
    ↓
LLM (Groq / OpenAI / Anthropic) → Réponse finale
    ↓
Réponse affichée avec sources
```

## Installation

```bash
pip install sentence-transformers chromadb PyPDF2 python-docx beautifulsoup4 python-dotenv groq openai anthropic
```

## Configuration

Dans `api_deploy/.env`, ajoutez votre clé API (une seule suffit) :

```env
# Option 1 — Groq (GRATUIT, recommandé) : https://console.groq.com
GROQ_API_KEY=gsk_...

# Option 2 — OpenAI
OPENAI_API_KEY=sk-...

# Option 3 — Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-...
```

Le pipeline détecte automatiquement quelle clé est disponible.

## Utilisation

### Étape 1 — Ingestion des documents

```bash
# Depuis le dossier racine du projet
python rag/pipeline.py --ingest

# Avec reset complet de la base
python rag/pipeline.py --ingest --reset
```

### Étape 2 — Poser une question

```bash
# Avec RAG (recommandé)
python rag/pipeline.py --question "Quelles compétences faut-il pour un stage en data science ?"

# Sans RAG (baseline pour comparaison)
python rag/pipeline.py --question "..." --no_rag

# Changer le nombre de chunks récupérés
python rag/pipeline.py --question "..." --top_k 5
```

### Mode interactif

```bash
python rag/pipeline.py
```

### Comparaison RAG vs Baseline

```bash
python rag/pipeline.py --compare
```

## Structure

```
rag/
├── config.py       — Paramètres centralisés (chunk_size, top_k, modèles)
├── ingest.py       — Chargement, chunking, embedding, indexation
├── retrieval.py    — Recherche des chunks pertinents (ChromaDB)
├── generation.py   — Prompt RAG + appel LLM (Groq/OpenAI/Anthropic/démo)
└── pipeline.py     — Orchestration complète + CLI

documents/
├── guide_data_science.txt   — Compétences et conseils pour stages data science
├── droits_stagiaires.txt    — Réglementation des stages en France
└── entretien_stage.txt      — Préparation aux entretiens de stage

evaluation/
└── comparaison.md           — Analyse RAG vs Baseline sur 5 questions

chroma_db/                   — Base vectorielle (générée automatiquement)
```

## Paramètres configurables (via .env)

| Variable | Défaut | Description |
|---|---|---|
| `CHUNK_SIZE` | 512 | Taille d'un chunk en caractères |
| `CHUNK_OVERLAP` | 64 | Chevauchement entre chunks |
| `TOP_K` | 4 | Nombre de chunks récupérés |
| `GROQ_MODEL` | llama3-8b-8192 | Modèle Groq |
| `LLM_MODEL` | gpt-3.5-turbo | Modèle OpenAI |
| `LLM_MAX_TOKENS` | 800 | Tokens max en réponse |
| `LLM_TEMPERATURE` | 0.2 | Créativité du LLM (0=factuel) |

## Intégration dans l'API FastAPI

```python
from rag.generation import generate_with_rag

@app.post("/ask")
def ask_question(body: dict):
    result = generate_with_rag(body["question"], top_k=4)
    return {
        "answer": result["answer"],
        "sources": [c["source"] for c in result["chunks"]],
        "chunks_count": len(result["chunks"]),
    }
```
