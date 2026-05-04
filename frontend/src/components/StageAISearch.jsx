import { useEffect, useState } from "react";

const HEALTH_URL = "http://localhost:8000";
const PREDICT_URL = "http://localhost:8000/predict";
const MIN_CHARS = 5;
const MAX_CHARS = 500;

function formatSimilarity(value) {
  const score = Number(value);
  if (Number.isNaN(score)) return 0;
  if (score > 0 && score <= 1) return Math.round(score * 100);
  if (score > 100) return Math.min(100, Math.round(score));
  return Math.round(score);
}

function previewText(text) {
  if (!text) return "Aucune description disponible.";
  return text.length > 180 ? `${text.slice(0, 180).trim()}...` : text;
}

function normalizeResponse(data) {
  if (!data) return [];
  if (Array.isArray(data.top_results)) return data.top_results;
  if (Array.isArray(data.results))     return data.results;
  if (Array.isArray(data.predictions)) return data.predictions;
  if (Array.isArray(data))             return data;
  return [];
}

export default function StageAISearch() {
  const [text, setText] = useState("");
  const [topK, setTopK] = useState(5);
  const [health, setHealth] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(HEALTH_URL);
        setHealth(res.ok ? "online" : "offline");
      } catch {
        setHealth("offline");
      }
    };

    checkHealth();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Veuillez décrire le stage ou le profil recherché.");
      return;
    }
    if (trimmedText.length < MIN_CHARS) {
      setError(`La description doit contenir au moins ${MIN_CHARS} caractères.`);
      return;
    }
    if (trimmedText.length > MAX_CHARS) {
      setError(`La description doit contenir au maximum ${MAX_CHARS} caractères.`);
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch(PREDICT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmedText, top_k: topK }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message = data?.message || data?.detail || `Erreur ${response.status}`;
        throw new Error(message);
      }

      const parsed = normalizeResponse(data);
      if (!parsed.length) {
        throw new Error("Aucun résultat trouvé. Essayez une autre recherche.");
      }

      setResults(
        parsed.map((item) => ({
          rank:        item.rank || 0,
          domain:      item.domaine            || item.domain      || "Général",
          title:       item.titre              || item.title       || `Résultat ${item.rank}`,
          description: item.description_preview || item.description || "Aucune description.",
          similarity:  formatSimilarity(item.confidence || item.similarity_score || 0),
        }))
      );
      setHealth("online");
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la recherche IA.");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setText("");
    setTopK(5);
    setError("");
    setResults(null);
  };

  const mergeStyles = (base, additional) => ({ ...base, ...additional });

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.pageTitle}>Recherche IA</h1>
          <p style={styles.pageSubtitle}>
            Trouvez des stages proches de votre description en utilisant le service IA.
          </p>
        </div>
        <div
          style={mergeStyles(
            styles.healthBadge,
            health === "online" ? styles.healthOnline : styles.healthOffline
          )}
        >
          {health === "checking"
            ? "Vérification du service..."
            : health === "online"
            ? "Service IA en ligne"
            : "Service IA hors ligne"}
        </div>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label} htmlFor="ia-search-text">
          Description libre du stage
        </label>
        <textarea
          id="ia-search-text"
          name="ia-search-text"
          value={text}
          maxLength={MAX_CHARS}
          rows={7}
          placeholder="Décrivez le type de stage, les missions, le domaine, ou le profil idéal..."
          style={styles.textarea}
          onChange={(e) => setText(e.target.value)}
        />
        <div style={styles.fieldHint}>
          {text.trim().length}/{MAX_CHARS} caractères
        </div>

        <div style={styles.rowGroup}>
          <label style={styles.label} htmlFor="top-k-select">
            Nombre de résultats
          </label>
          <select
            id="top-k-select"
            value={topK}
            style={styles.select}
            onChange={(e) => setTopK(Number(e.target.value))}
          >
            <option value={3}>3 résultats</option>
            <option value={5}>5 résultats</option>
            <option value={10}>10 résultats</option>
          </select>
        </div>

        <button type="submit" style={mergeStyles(styles.button, loading && styles.buttonDisabled)} disabled={loading}>
          {loading ? "Recherche en cours..." : "Lancer la recherche"}
          {loading && <span style={styles.spinner}></span>}
        </button>
      </form>

      {error && (
        <div style={styles.errorBanner}>
          <span style={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div style={styles.loadingPanel}>
          <div style={styles.spinnerLarge}></div>
          <p style={styles.loadingText}>Le modèle IA recherche les stages correspondants...</p>
        </div>
      )}

      {results && !loading && (
        <section style={styles.resultsSection}>
          <div style={styles.resultsHeader}>
            <div>
              <p style={styles.resultsLabel}>Résultats trouvés</p>
              <h2 style={styles.resultsTitle}>Les meilleures correspondances sont listées ci-dessous.</h2>
            </div>
            <button type="button" style={styles.secondaryButton} onClick={resetSearch}>
              Nouvelle recherche
            </button>
          </div>

          <div style={styles.cardsGrid}>
            {results.map((item) => (
              <article key={item.rank} style={styles.card}>
                <div style={styles.cardHeaderLine}>
                  <span style={styles.rankBadge}>#{item.rank}</span>
                  <span style={styles.domainBadge}>{item.domain}</span>
                </div>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardDescription}>{previewText(item.description)}</p>
                <div style={styles.similarityRow}>
                  <span style={styles.similarityLabel}>Confiance</span>
                  <span style={styles.similarityValue}>{item.similarity}%</span>
                </div>
                <div style={styles.progressBarBackground}>
                  <div style={mergeStyles(styles.progressBarFill, { width: `${item.similarity}%` })} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "1.5rem",
    background: "#ffffff",
    borderRadius: "1.5rem",
    boxShadow: "0 24px 60px rgba(219, 39, 119, 0.12)",
    border: "1px solid #fee2e2"
  },
  headerRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "1.75rem"
  },
  pageTitle: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "0.5rem"
  },
  pageSubtitle: {
    fontSize: "0.95rem",
    color: "#4b5563",
    maxWidth: "38rem",
    lineHeight: "1.7"
  },
  healthBadge: {
    padding: "0.65rem 1rem",
    borderRadius: "9999px",
    fontWeight: "600",
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
    boxShadow: "0 10px 30px rgba(219, 39, 119, 0.12)"
  },
  healthOnline: {
    background: "#dcfce7",
    color: "#166534"
  },
  healthOffline: {
    background: "#fee2e2",
    color: "#b91c1c"
  },
  form: {
    display: "grid",
    gap: "1rem",
    marginBottom: "1.75rem"
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#374151"
  },
  textarea: {
    width: "100%",
    minHeight: "180px",
    borderRadius: "1rem",
    border: "1.5px solid #f3e8ff",
    background: "#faf5ff",
    color: "#111827",
    fontSize: "0.95rem",
    padding: "1rem",
    resize: "vertical",
    outline: "none"
  },
  fieldHint: {
    fontSize: "0.85rem",
    color: "#6b7280",
    textAlign: "right"
  },
  rowGroup: {
    display: "grid",
    gap: "0.75rem"
  },
  select: {
    width: "100%",
    borderRadius: "0.95rem",
    border: "1.5px solid #f3e8ff",
    background: "#ffffff",
    color: "#111827",
    padding: "0.9rem 1rem",
    fontSize: "0.95rem",
    outline: "none"
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "0.95rem 1.25rem",
    borderRadius: "0.95rem",
    border: "none",
    color: "white",
    background: "linear-gradient(135deg, #db2777 0%, #f472b6 100%)",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "transform 0.2s ease, opacity 0.2s ease"
  },
  buttonDisabled: {
    opacity: "0.65",
    cursor: "not-allowed"
  },
  spinner: {
    width: "1rem",
    height: "1rem",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 1.25rem",
    borderRadius: "1rem",
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca"
  },
  errorIcon: {
    fontSize: "1.1rem"
  },
  loadingPanel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "1.5rem",
    borderRadius: "1rem",
    background: "#faf5ff",
    border: "1px solid #f3e8ff"
  },
  spinnerLarge: {
    width: "3rem",
    height: "3rem",
    border: "4px solid rgba(219, 39, 119, 0.2)",
    borderTopColor: "#db2777",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    fontSize: "0.95rem",
    color: "#4b5563",
    textAlign: "center"
  },
  resultsSection: {
    display: "grid",
    gap: "1.5rem"
  },
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap"
  },
  resultsLabel: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#db2777",
    textTransform: "uppercase",
    letterSpacing: "0.08em"
  },
  resultsTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#111827",
    margin: 0
  },
  secondaryButton: {
    padding: "0.85rem 1.15rem",
    borderRadius: "0.95rem",
    border: "1px solid #f3e8ff",
    background: "white",
    color: "#7c3aed",
    fontWeight: "700",
    cursor: "pointer"
  },
  cardsGrid: {
    display: "grid",
    gap: "1rem"
  },
  card: {
    padding: "1.25rem",
    borderRadius: "1.25rem",
    background: "#ffffff",
    border: "1px solid #f3e8ff",
    boxShadow: "0 10px 30px rgba(219, 39, 119, 0.08)"
  },
  cardHeaderLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    marginBottom: "1rem"
  },
  rankBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2rem",
    height: "2rem",
    borderRadius: "9999px",
    background: "#fce7f3",
    color: "#be185d",
    fontWeight: "700"
  },
  domainBadge: {
    padding: "0.5rem 0.9rem",
    borderRadius: "9999px",
    background: "#ede9fe",
    color: "#7c3aed",
    fontSize: "0.8rem",
    fontWeight: "700"
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    margin: "0 0 0.75rem",
    color: "#111827"
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: "#4b5563",
    lineHeight: "1.75",
    margin: "0 0 1rem"
  },
  similarityRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    marginBottom: "0.75rem"
  },
  similarityLabel: {
    fontSize: "0.85rem",
    color: "#6b7280"
  },
  similarityValue: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#111827"
  },
  progressBarBackground: {
    width: "100%",
    height: "0.75rem",
    borderRadius: "9999px",
    background: "#f3e8ff",
    overflow: "hidden"
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "9999px",
    background: "linear-gradient(135deg, #db2777 0%, #f472b6 100%)"
  }
};
