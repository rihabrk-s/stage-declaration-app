"""
ingest.py — Chargement, chunking, embedding et indexation des documents
Devoir 6 — Pipeline RAG

Usage :
    python ingest.py                    # ingère tous les documents du dossier documents/
    python ingest.py --reset            # vide la base vectorielle puis ingère
    python ingest.py --file mon.pdf     # ingère un seul fichier
"""
import argparse
import logging
import shutil
import sys
import time
import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
from typing import List, Dict, Any

# ── Embeddings & Vector store ─────────────────────────────────────────────────
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

# ── Parsing ───────────────────────────────────────────────────────────────────
import PyPDF2
from docx import Document as DocxDocument
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import (
    DOCUMENTS_DIR, CHROMA_DIR,
    CHUNK_SIZE, CHUNK_OVERLAP,
    EMBEDDING_MODEL,
)

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
log = logging.getLogger(__name__)


# ══════════════════════════════════════════════════════════════════════════════
# 1. PARSING — extraction du texte brut depuis différents formats
# ══════════════════════════════════════════════════════════════════════════════

def parse_pdf(path: Path) -> str:
    """Extrait le texte d'un fichier PDF page par page."""
    text_parts = []
    with open(path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text_parts.append(extracted)
    return "\n".join(text_parts)


def parse_docx(path: Path) -> str:
    """Extrait le texte d'un fichier Word (.docx)."""
    doc = DocxDocument(str(path))
    return "\n".join(para.text for para in doc.paragraphs if para.text.strip())


def parse_html(path: Path) -> str:
    """Extrait le texte visible d'un fichier HTML."""
    with open(path, encoding="utf-8", errors="replace") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


def parse_txt(path: Path) -> str:
    """Lit un fichier texte brut."""
    return path.read_text(encoding="utf-8", errors="replace")


PARSERS = {
    ".pdf":  parse_pdf,
    ".docx": parse_docx,
    ".html": parse_html,
    ".htm":  parse_html,
    ".txt":  parse_txt,
    ".md":   parse_txt,
}


def load_document(path: Path) -> str:
    """Dispatch vers le bon parser selon l'extension."""
    ext = path.suffix.lower()
    if ext not in PARSERS:
        raise ValueError(f"Format non supporté : {ext}")
    log.info(f"  Parsing  {path.name} …")
    return PARSERS[ext](path)


# ══════════════════════════════════════════════════════════════════════════════
# 2. CHUNKING — découpage en segments avec chevauchement
# ══════════════════════════════════════════════════════════════════════════════

def chunk_text(
    text: str,
    source: str,
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> List[Dict[str, Any]]:
    """
    Découpe `text` en chunks de `chunk_size` caractères
    avec un chevauchement de `overlap` caractères.

    Retourne une liste de dicts : {text, source, chunk_index}
    """
    chunks = []
    start = 0
    idx = 0
    text = text.strip()

    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk = text[start:end].strip()
        if chunk:
            chunks.append({
                "text": chunk,
                "source": source,
                "chunk_index": idx,
            })
            idx += 1
        start += chunk_size - overlap   # avance avec chevauchement

    log.info(f"  → {len(chunks)} chunks créés (size={chunk_size}, overlap={overlap})")
    return chunks


# ══════════════════════════════════════════════════════════════════════════════
# 3. EMBEDDING & INDEXATION
# ══════════════════════════════════════════════════════════════════════════════

def get_chroma_collection(reset: bool = False):
    """Initialise (ou recharge) la collection ChromaDB."""
    if reset and CHROMA_DIR.exists():
        log.info(f"  Reset : suppression de {CHROMA_DIR}")
        shutil.rmtree(CHROMA_DIR)

    CHROMA_DIR.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(
        path=str(CHROMA_DIR),
        settings=Settings(anonymized_telemetry=False),
    )
    collection = client.get_or_create_collection(
        name="rag_stages",
        metadata={"hnsw:space": "cosine"},
    )
    return collection


def embed_and_index(
    chunks: List[Dict[str, Any]],
    collection,
    model: SentenceTransformer,
) -> None:
    """Génère les embeddings et les insère dans ChromaDB."""
    texts = [c["text"] for c in chunks]
    log.info(f"  Génération des embeddings pour {len(texts)} chunks …")
    t0 = time.perf_counter()
    embeddings = model.encode(texts, show_progress_bar=True)
    embeddings = [e.tolist() for e in embeddings]
    ms = (time.perf_counter() - t0) * 1000
    log.info(f"  Embeddings générés en {ms:.0f} ms")

    ids        = [f"{c['source']}__chunk{c['chunk_index']}" for c in chunks]
    metadatas  = [{"source": c["source"], "chunk_index": c["chunk_index"]} for c in chunks]

    # Insertion par batch de 512 pour éviter les limites mémoire
    BATCH = 512
    for i in range(0, len(ids), BATCH):
        collection.add(
            ids=ids[i:i+BATCH],
            embeddings=embeddings[i:i+BATCH],
            documents=texts[i:i+BATCH],
            metadatas=metadatas[i:i+BATCH],
        )
    log.info(f"  {len(ids)} vecteurs indexés dans ChromaDB.")


# ══════════════════════════════════════════════════════════════════════════════
# 4. PIPELINE D'INGESTION PRINCIPAL
# ══════════════════════════════════════════════════════════════════════════════

def ingest(files: List[Path] = None, reset: bool = False) -> int:
    """
    Ingère les documents dans la base vectorielle.

    Args:
        files:  liste de fichiers à traiter (None = tout DOCUMENTS_DIR)
        reset:  vider la base avant ingestion

    Returns:
        nombre de chunks indexés
    """
    log.info("=" * 60)
    log.info("INGESTION — Pipeline RAG (Devoir 6)")
    log.info("=" * 60)

    # Chargement du modèle d'embedding
    log.info(f"Chargement du modèle d'embedding : {EMBEDDING_MODEL}")
    model = SentenceTransformer(EMBEDDING_MODEL)

    # Collection vectorielle
    collection = get_chroma_collection(reset=reset)

    # Liste des fichiers à traiter
    if files is None:
        files = [
            p for p in DOCUMENTS_DIR.iterdir()
            if p.suffix.lower() in PARSERS and p.is_file()
        ]

    if not files:
        log.warning("Aucun document trouvé dans documents/. Ajoutez des fichiers PDF, TXT ou HTML.")
        return 0

    log.info(f"{len(files)} document(s) trouvé(s) : {[f.name for f in files]}")

    total_chunks = []
    for path in files:
        try:
            raw_text = load_document(path)
            chunks   = chunk_text(raw_text, source=path.name)
            total_chunks.extend(chunks)
        except Exception as exc:
            log.error(f"  Erreur sur {path.name} : {exc}")

    if not total_chunks:
        log.warning("Aucun chunk généré.")
        return 0

    embed_and_index(total_chunks, collection, model)

    log.info("=" * 60)
    log.info(f"INGESTION TERMINÉE — {len(total_chunks)} chunks indexés.")
    log.info("=" * 60)
    return len(total_chunks)


# ── CLI ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingestion RAG — chargement et indexation des documents")
    parser.add_argument("--reset", action="store_true", help="Vider la base vectorielle avant ingestion")
    parser.add_argument("--file",  type=str, default=None, help="Ingérer un fichier spécifique")
    args = parser.parse_args()

    target_files = None
    if args.file:
        p = Path(args.file)
        if not p.exists():
            p = DOCUMENTS_DIR / args.file
        target_files = [p]

    ingest(files=target_files, reset=args.reset)
