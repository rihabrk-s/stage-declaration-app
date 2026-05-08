// frontend/src/pages/AssistantIA.jsx
// Page d'assistant IA RAG — intégrée dans la plateforme de stages
import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:4000/api";

function Message({ msg }) {
  const isUser = msg.role === "user";

  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "1rem",
      gap: "0.75rem",
      alignItems: "flex-end",
    },
    avatar: {
      width: "2rem",
      height: "2rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1rem",
      flexShrink: 0,
      background: isUser
        ? "linear-gradient(135deg, #db2777, #f472b6)"
        : "linear-gradient(135deg, #7c3aed, #a78bfa)",
      order: isUser ? 1 : 0,
    },
    bubble: {
      maxWidth: "75%",
      padding: "0.875rem 1.125rem",
      borderRadius: isUser ? "1.25rem 1.25rem 0.25rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.25rem",
      fontSize: "0.875rem",
      lineHeight: "1.6",
      background: isUser
        ? "linear-gradient(135deg, #db2777, #f472b6)"
        : "white",
      color: isUser ? "white" : "#1f2937",
      boxShadow: isUser
        ? "0 4px 12px rgba(219,39,119,0.25)"
        : "0 2px 8px rgba(0,0,0,0.08)",
      border: isUser ? "none" : "1px solid #fce7f3",
    },
    sources: {
      marginTop: "0.5rem",
      fontSize: "0.75rem",
      color: "#9ca3af",
      display: "flex",
      flexWrap: "wrap",
      gap: "0.375rem",
    },
    sourceChip: {
      background: "#fdf2f8",
      border: "1px solid #fce7f3",
      borderRadius: "20px",
      padding: "0.125rem 0.5rem",
      color: "#be185d",
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.avatar}>{isUser ? "👤" : "🤖"}</div>
      <div>
        <div style={styles.bubble}>
          {msg.content}
        </div>
        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div style={styles.sources}>
            <span>Sources :</span>
            {[...new Set(msg.sources)].map((s, i) => (
              <span key={i} style={styles.sourceChip}>📄 {s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssistantIA() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant IA spécialisé dans les stages. Posez-moi vos questions sur les compétences requises, les droits des stagiaires, ou la préparation aux entretiens. 🎓",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const SUGGESTIONS = [
    "Quelles compétences pour un stage en data science ?",
    "Quels sont les droits d'un stagiaire ?",
    "Comment préparer un entretien de stage ?",
    "Quelle est la durée moyenne d'un stage ?",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question || loading) return;

    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/rag/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, top_k: 4 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Erreur ${res.status}`);
      }

      const sources = (data.chunks || []).map((c) => c.source).filter(Boolean);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "Désolé, je n'ai pas pu générer de réponse.",
          sources,
        },
      ]);
    } catch (err) {
      if (err.name === "TypeError") {
        setError("Impossible de joindre le backend. Vérifiez que le serveur tourne sur http://localhost:4000.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const styles = {
    container: { maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", height: "520px" },
    chatWindow: {
      flex: 1, overflowY: "auto", padding: "1rem",
      background: "linear-gradient(180deg, #fdf2f8 0%, #fff 100%)",
      borderRadius: "1rem", border: "1px solid #fce7f3",
      marginBottom: "1rem",
    },
    suggestions: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" },
    chip: {
      background: "white", border: "1px solid #fce7f3", borderRadius: "20px",
      padding: "0.4rem 0.875rem", fontSize: "0.78rem", color: "#be185d",
      cursor: "pointer", fontWeight: 500, transition: "all 0.2s",
    },
    inputRow: { display: "flex", gap: "0.75rem", alignItems: "flex-end" },
    textarea: {
      flex: 1, padding: "0.75rem 1rem", borderRadius: "0.875rem",
      border: "1.5px solid #fce7f3", fontSize: "0.875rem",
      fontFamily: "inherit", resize: "none", outline: "none",
      background: "white", color: "#1f2937", lineHeight: "1.5",
      transition: "border-color 0.2s",
    },
    sendBtn: {
      padding: "0.75rem 1.25rem",
      background: loading ? "#f3f4f6" : "linear-gradient(135deg, #db2777, #f472b6)",
      color: loading ? "#9ca3af" : "white",
      border: "none", borderRadius: "0.875rem",
      fontSize: "0.875rem", fontWeight: 600,
      cursor: loading ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", gap: "0.4rem",
      whiteSpace: "nowrap", transition: "all 0.2s",
    },
    loadingDots: { display: "flex", gap: "4px", padding: "0.5rem 1rem" },
    dot: {
      width: "8px", height: "8px", borderRadius: "50%",
      background: "#f472b6", animation: "bounce 1.2s infinite",
    },
    errorBox: {
      background: "#fef2f2", border: "1px solid #fecaca",
      borderRadius: "0.75rem", padding: "0.75rem 1rem",
      fontSize: "0.8rem", color: "#dc2626",
      marginBottom: "0.75rem", display: "flex", gap: "0.5rem",
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .rag-chip:hover { background: #fdf2f8 !important; transform: translateY(-1px); }
        .rag-send:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(219,39,119,0.3); }
        .rag-input:focus { border-color: #f472b6 !important; box-shadow: 0 0 0 3px rgba(244,114,182,0.1); }
      `}</style>

      {/* Fenêtre de chat */}
      <div style={styles.chatWindow}>
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</div>
            <div style={{ background: "white", border: "1px solid #fce7f3", borderRadius: "1.25rem 1.25rem 1.25rem 0.25rem", padding: "0.75rem 1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <div style={styles.loadingDots}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={styles.suggestions}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="rag-chip" style={styles.chip} onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div style={styles.errorBox}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Zone de saisie */}
      <div style={styles.inputRow}>
        <textarea
          className="rag-input"
          style={styles.textarea}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question sur les stages… (Entrée pour envoyer)"
          disabled={loading}
        />
        <button
          className="rag-send"
          style={styles.sendBtn}
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          {loading ? "⟳" : "Envoyer ✈"}
        </button>
      </div>
    </div>
  );
}
