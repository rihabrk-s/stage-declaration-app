"""
retrieval.py — Recherche des chunks pertinents dans la base vectorielle
Devoir 6 — Pipeline RAG

Usage :
    python retrieval.py "Quelles compétences faut-il pour un stage en data science ?"
    python retrieval.py "stage marketing digital" --top_k 5
"""
import argparse
import logging
import sys
from pathlib import Path
from typing import List, Dict, Any

from sentence_transformers import SentenceTransformer
import chromadb

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import CHROMA_DIR, EMBEDDING_MODEL, TOP_K

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
log = logging.getLogger(__name__)


# ══════════════════════════════════════════════════════════════════════════════
# Initialisation (singleton léger)
# ══════════════════════════════════════════════════════════════════════════════

_embedding_model: SentenceTransformer = None
_chroma_collection = None


def _load_resources():
    """Charge le modèle et la collection une seule fois."""
    global _embedding_model, _chroma_collection

    if _embedding_model is None:
        log.info(f"Chargement du modèle d'embedding : {EMBEDDING_MODEL}")
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL)

    if _chroma_collection is None:
        if not CHROMA_DIR.exists():
            raise RuntimeError(
                "Base vectorielle introuvable. Lancez d'abord : python rag/ingest.py"
            )
        client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        _chroma_collection = client.get_or_create_collection(
            name="rag_stages",
            metadata={"hnsw:space": "cosine"},
        )
        log.info(f"Collection ChromaDB chargée ({_chroma_collection.count()} chunks).")


# ══════════════════════════════════════════════════════════════════════════════
# Fonction principale de retrieval
# ══════════════════════════════════════════════════════════════════════════════

def retrieve(question: str, top_k: int = TOP_K) -> List[Dict[str, Any]]:
    """
    Recherche les `top_k` chunks les plus similaires à `question`.

    Args:
        question : question en langage naturel
        top_k    : nombre de résultats à retourner (configurable via TOP_K dans config.py
                   ou la variable d'environnement TOP_K)

    Returns:
        Liste de dicts :
            - text        : contenu du chunk
            - source      : nom du document source
            - chunk_index : index du chunk dans le document
            - score       : similarité cosinus (0–1, plus grand = plus similaire)
    """
    _load_resources()

    log.info(f"Recherche (top_k={top_k}) : « {question[:80]} »")

    # Embedding de la question
    query_vec = _embedding_model.encode([question], convert_to_numpy=True)[0].tolist()

    # Requête ChromaDB
    results = _chroma_collection.query(
        query_embeddings=[query_vec],
        n_results=min(top_k, _chroma_collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    for i, (doc, meta, dist) in enumerate(zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    )):
        # ChromaDB retourne une distance cosinus (0 = identique, 2 = opposé)
        # On la convertit en similarité [0, 1]
        similarity = 1 - dist / 2
        chunks.append({
            "rank":        i + 1,
            "text":        doc,
            "source":      meta.get("source", "inconnu"),
            "chunk_index": meta.get("chunk_index", -1),
            "score":       round(similarity, 4),
        })

    return chunks


def format_chunks_for_display(chunks: List[Dict[str, Any]]) -> str:
    """Formatte les chunks récupérés pour affichage console."""
    lines = []
    for c in chunks:
        lines.append(
            f"\n{'─' * 60}\n"
            f"[Chunk #{c['rank']} | Source : {c['source']} | Score : {c['score']:.4f}]\n"
            f"{c['text'][:400]}{'…' if len(c['text']) > 400 else ''}"
        )
    return "\n".join(lines)


def build_context(chunks: List[Dict[str, Any]]) -> str:
    """Concatène les textes des chunks pour former le contexte du prompt RAG."""
    parts = []
    for c in chunks:
        parts.append(f"[Source : {c['source']}]\n{c['text']}")
    return "\n\n".join(parts)


# ── CLI ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Retrieval RAG — recherche de chunks similaires")
    parser.add_argument("question", type=str, help="Question à rechercher")
    parser.add_argument("--top_k", type=int, default=TOP_K, help=f"Nombre de résultats (défaut : {TOP_K})")
    args = parser.parse_args()

    chunks = retrieve(args.question, top_k=args.top_k)

    print(f"\n{'═' * 60}")
    print(f"Question : {args.question}")
    print(f"Top-{args.top_k} chunks récupérés :")
    print(format_chunks_for_display(chunks))
    print(f"\n{'═' * 60}")
    print(f"CONTEXTE ASSEMBLÉ ({len(chunks)} chunks) :")
    print(build_context(chunks))