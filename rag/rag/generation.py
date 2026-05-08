"""
generation.py — Construction du prompt enrichi et appel au LLM
Devoir 6 — Pipeline RAG : Retrieval Augmented Generation

Supporte (par ordre de priorité) :
    1. Groq  (GROQ_API_KEY)          — gratuit, recommandé, modèle llama3-8b-8192
    2. OpenAI (OPENAI_API_KEY)       — payant, gpt-3.5-turbo
    3. Anthropic (ANTHROPIC_API_KEY) — claude-haiku
    4. Mode démo                     — réponse simulée si aucune clé n'est définie

Usage :
    python generation.py "Quelles sont les compétences requises pour un stage en IA ?"
    python generation.py "..." --no_rag    # test baseline sans RAG
"""
import argparse
import logging
import os
import sys
from pathlib import Path
from typing import List, Dict, Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import (
    OPENAI_API_KEY, LLM_MODEL, LLM_MAX_TOKENS, LLM_TEMPERATURE,
    RAG_PROMPT_TEMPLATE, BASELINE_PROMPT_TEMPLATE, TOP_K,
)
from retrieval import retrieve, build_context

GROQ_API_KEY      = os.getenv("GROQ_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
log = logging.getLogger(__name__)


# ══════════════════════════════════════════════════════════════════════════════
# Construction du prompt
# ══════════════════════════════════════════════════════════════════════════════

def build_rag_prompt(question: str, chunks: List[Dict[str, Any]]) -> str:
    context = build_context(chunks)
    return RAG_PROMPT_TEMPLATE.format(context=context, question=question)


def build_baseline_prompt(question: str) -> str:
    return BASELINE_PROMPT_TEMPLATE.format(question=question)


# ══════════════════════════════════════════════════════════════════════════════
# Appel LLM — détection automatique du provider
# ══════════════════════════════════════════════════════════════════════════════

def call_llm(prompt: str, use_rag: bool = True) -> str:
    """
    Envoie le prompt au LLM disponible (Groq > OpenAI > Anthropic > démo).
    """
    if GROQ_API_KEY:
        return _call_groq(prompt, use_rag)
    elif OPENAI_API_KEY:
        return _call_openai(prompt, use_rag)
    elif ANTHROPIC_API_KEY:
        return _call_anthropic(prompt, use_rag)
    else:
        log.warning(
            "Aucune clé API trouvée. Mode démo activé. "
            "Ajoutez GROQ_API_KEY dans .env (gratuit sur console.groq.com)."
        )
        return _demo_response(prompt, use_rag)


def _call_groq(prompt: str, use_rag: bool) -> str:
    try:
        from groq import Groq
    except ImportError:
        raise ImportError("Installez groq : pip install groq")

    model = os.getenv("GROQ_MODEL", "llama3-8b-8192")
    log.info(f"Appel LLM via Groq ({model}) — {'RAG' if use_rag else 'Baseline'} …")

    client = Groq(api_key=GROQ_API_KEY)
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": (
                    "Tu es un assistant expert en stages et emplois étudiants au Maroc et en France. "
                    "Réponds en français, de manière précise et structurée."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=LLM_MAX_TOKENS,
        temperature=LLM_TEMPERATURE,
    )
    return response.choices[0].message.content.strip()


def _call_openai(prompt: str, use_rag: bool) -> str:
    try:
        from openai import OpenAI
    except ImportError:
        raise ImportError("Installez openai : pip install openai")

    log.info(f"Appel LLM via OpenAI ({LLM_MODEL}) — {'RAG' if use_rag else 'Baseline'} …")
    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {
                "role": "system",
                "content": "Tu es un assistant expert en stages. Réponds en français.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=LLM_MAX_TOKENS,
        temperature=LLM_TEMPERATURE,
    )
    return response.choices[0].message.content.strip()


def _call_anthropic(prompt: str, use_rag: bool) -> str:
    try:
        import anthropic
    except ImportError:
        raise ImportError("Installez anthropic : pip install anthropic")

    model = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001")
    log.info(f"Appel LLM via Anthropic ({model}) — {'RAG' if use_rag else 'Baseline'} …")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    message = client.messages.create(
        model=model,
        max_tokens=LLM_MAX_TOKENS,
        system=(
            "Tu es un assistant expert en stages et emplois étudiants au Maroc et en France. "
            "Réponds en français, de manière précise et structurée."
        ),
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text.strip()


def _demo_response(prompt: str, use_rag: bool) -> str:
    mode = "RAG (avec contexte)" if use_rag else "Baseline (sans contexte)"
    lines = prompt.split("\n")
    question_line = next((l for l in lines if l.startswith("Question :")), "")
    return (
        f"[MODE DÉMO — {mode}]\n\n"
        f"Prompt reçu ({len(prompt)} caractères).\n"
        f"{question_line}\n\n"
        "→ Pour obtenir une vraie réponse, ajoutez dans votre fichier .env :\n"
        "   GROQ_API_KEY=gsk_...   (gratuit sur console.groq.com)\n"
        "   ou OPENAI_API_KEY=sk-...\n"
        "   ou ANTHROPIC_API_KEY=sk-ant-..."
    )


# ══════════════════════════════════════════════════════════════════════════════
# Fonctions exposées au pipeline
# ══════════════════════════════════════════════════════════════════════════════

def generate_with_rag(question: str, top_k: int = TOP_K) -> Dict[str, Any]:
    chunks = retrieve(question, top_k=top_k)
    prompt = build_rag_prompt(question, chunks)
    answer = call_llm(prompt, use_rag=True)
    return {"question": question, "chunks": chunks, "prompt": prompt, "answer": answer, "mode": "rag"}


def generate_baseline(question: str) -> Dict[str, Any]:
    prompt = build_baseline_prompt(question)
    answer = call_llm(prompt, use_rag=False)
    return {"question": question, "chunks": [], "prompt": prompt, "answer": answer, "mode": "baseline"}


# ── CLI ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Génération RAG — appel LLM avec contexte")
    parser.add_argument("question", type=str, help="Question à poser")
    parser.add_argument("--no_rag", action="store_true", help="Mode baseline (sans RAG)")
    parser.add_argument("--top_k",  type=int, default=TOP_K, help=f"Nombre de chunks (défaut : {TOP_K})")
    args = parser.parse_args()

    if args.no_rag:
        result = generate_baseline(args.question)
        print(f"\n{'═' * 60}\nBASELINE (sans RAG)\n{'═' * 60}")
    else:
        result = generate_with_rag(args.question, top_k=args.top_k)
        print(f"\n{'═' * 60}\nRÉPONSE RAG (top_k={args.top_k})\n{'═' * 60}")
        for c in result["chunks"]:
            print(f"  #{c['rank']} [{c['source']}] score={c['score']:.4f} — {c['text'][:120]}…")

    print(f"\nQuestion : {result['question']}")
    print(f"\nRéponse :\n{result['answer']}")
