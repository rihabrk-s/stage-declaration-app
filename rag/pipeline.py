"""
pipeline.py — Orchestration complète du pipeline RAG
Devoir 6 — Pipeline RAG : Retrieval Augmented Generation

Point d'entrée principal pour :
    - poser une question en ligne de commande
    - lancer l'interface Q&A interactive
    - exécuter la comparaison RAG vs baseline (5 questions)

Usage :
    python pipeline.py                                    # mode interactif Q&A
    python pipeline.py --question "..."                   # question unique
    python pipeline.py --compare                          # comparaison RAG vs baseline
    python pipeline.py --ingest                           # réingestion des documents
    python pipeline.py --ingest --reset                   # reset + réingestion
"""
import argparse
import json
import logging
import sys
import textwrap
import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
from typing import Optional

if "--json" in sys.argv:
    import logging as _early_log
    _early_log.disable(_early_log.CRITICAL)

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import TOP_K
from generation import generate_with_rag, generate_baseline
from ingest import ingest

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
log = logging.getLogger(__name__)

SEPARATOR = "═" * 65


# ══════════════════════════════════════════════════════════════════════════════
# Affichage
# ══════════════════════════════════════════════════════════════════════════════

def _print_result(result: dict, show_chunks: bool = True) -> None:
    mode_label = "RAG (avec contexte)" if result["mode"] == "rag" else "BASELINE (sans RAG)"
    print(f"\n{SEPARATOR}")
    print(f"  MODE : {mode_label}")
    print(SEPARATOR)

    if show_chunks and result.get("chunks"):
        print(f"\n📚 Chunks récupérés (top-{len(result['chunks'])}) :")
        for c in result["chunks"]:
            preview = textwrap.shorten(c["text"], width=120, placeholder="…")
            print(f"  #{c['rank']}  [{c['source']}]  score={c['score']:.4f}")
            print(f"       {preview}")

    print(f"\n❓ Question : {result['question']}")
    print(f"\n💬 Réponse :\n{result['answer']}")
    print(SEPARATOR)


# ══════════════════════════════════════════════════════════════════════════════
# Mode : question unique
# ══════════════════════════════════════════════════════════════════════════════

def run_single(question: str, top_k: int = TOP_K, no_rag: bool = False, json_output: bool = False) -> dict:
    """Pose une question et affiche la réponse RAG (ou baseline)."""
    if no_rag:
        result = generate_baseline(question)
    else:
        result = generate_with_rag(question, top_k=top_k)
    
    if not json_output:
        _print_result(result)
    
    return result


# ══════════════════════════════════════════════════════════════════════════════
# Mode : interface Q&A interactive
# ══════════════════════════════════════════════════════════════════════════════

def run_interactive(top_k: int = TOP_K) -> None:
    """Boucle interactive — pose des questions jusqu'à 'quit'."""
    print(f"\n{SEPARATOR}")
    print("  ASSISTANT STAGES — Pipeline RAG  (Devoir 6)")
    print(f"  top_k={top_k} | tapez 'quit' pour quitter")
    print(SEPARATOR)

    while True:
        try:
            question = input("\n❓ Votre question : ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nAu revoir !")
            break

        if not question:
            continue
        if question.lower() in ("quit", "exit", "q"):
            print("Au revoir !")
            break

        result = generate_with_rag(question, top_k=top_k)
        _print_result(result, show_chunks=True)


# ══════════════════════════════════════════════════════════════════════════════
# Mode : comparaison RAG vs Baseline
# ══════════════════════════════════════════════════════════════════════════════

COMPARISON_QUESTIONS = [
    "Quelles compétences techniques sont les plus demandées pour un stage en data science ?",
    "Comment rédiger une lettre de motivation efficace pour un stage en entreprise ?",
    "Quelle est la durée moyenne d'un stage de fin d'études en informatique ?",
    "Quels sont les droits et obligations d'un stagiaire en France concernant la gratification ?",
    "Comment préparer un entretien pour un stage dans une startup technologique ?",
]


def run_comparison(top_k: int = TOP_K, output_json: Optional[str] = None) -> None:
    """
    Pose les 5 questions de comparaison avec et sans RAG.
    Affiche les résultats et optionnellement les sauvegarde en JSON.
    """
    print(f"\n{SEPARATOR}")
    print("  COMPARAISON RAG vs BASELINE — 5 questions")
    print(SEPARATOR)

    comparisons = []
    for i, question in enumerate(COMPARISON_QUESTIONS, 1):
        print(f"\n{'─' * 65}")
        print(f"  Question {i}/{len(COMPARISON_QUESTIONS)}")
        print(f"  {question}")
        print("─" * 65)

        rag_result      = generate_with_rag(question, top_k=top_k)
        baseline_result = generate_baseline(question)

        print(f"\n[BASELINE] {baseline_result['answer'][:500]}")
        print(f"\n[RAG]      {rag_result['answer'][:500]}")

        comparisons.append({
            "question_index": i,
            "question":       question,
            "baseline_answer": baseline_result["answer"],
            "rag_answer":      rag_result["answer"],
            "chunks_used":     [
                {"source": c["source"], "score": c["score"], "preview": c["text"][:200]}
                for c in rag_result["chunks"]
            ],
        })

    if output_json:
        Path(output_json).write_text(
            json.dumps(comparisons, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        log.info(f"Résultats sauvegardés dans {output_json}")

    print(f"\n{SEPARATOR}")
    print("  Comparaison terminée. Voir evaluation/comparaison.md pour l'analyse.")
    print(SEPARATOR)


# ══════════════════════════════════════════════════════════════════════════════
# CLI principal
# ══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="Pipeline RAG — orchestration complète (Devoir 6)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Exemples :
              python pipeline.py                         # mode interactif
              python pipeline.py --question "..."        # question unique (RAG)
              python pipeline.py --question "..." --no_rag  # baseline sans RAG
              python pipeline.py --compare               # comparaison 5 questions
              python pipeline.py --ingest --reset        # réingestion complète
        """),
    )
    parser.add_argument("--question", "-q", type=str, help="Poser une question unique")
    parser.add_argument("--no_rag",   action="store_true", help="Mode baseline sans RAG")
    parser.add_argument("--compare",  action="store_true", help="Lancer la comparaison RAG vs baseline")
    parser.add_argument("--ingest",   action="store_true", help="Réingérer les documents")
    parser.add_argument("--reset",    action="store_true", help="Vider la base avant ingestion")
    parser.add_argument("--top_k",    type=int, default=TOP_K,
                        help=f"Nombre de chunks à récupérer (défaut : {TOP_K})")
    parser.add_argument("--output_json", type=str, default=None,
                        help="Sauvegarder les résultats de comparaison en JSON")
    parser.add_argument("--json", action="store_true", help="Sortie JSON pure (pour intégration)")
    args = parser.parse_args()

    if args.ingest:
        ingest(reset=args.reset)
        return

    if args.compare:
        run_comparison(top_k=args.top_k, output_json=args.output_json)
        return

    if args.question:
        result = run_single(args.question, top_k=args.top_k, no_rag=args.no_rag, json_output=args.json)
        if args.json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    # Mode par défaut : interactif
    run_interactive(top_k=args.top_k)


if __name__ == "__main__":
    main()