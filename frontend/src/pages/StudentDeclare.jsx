import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDeclare() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    entreprise: "",
    sujet: "",
    dateDebut: "",
    dateFin: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          entreprise: form.entreprise,
          sujet: form.sujet,
          date_debut: form.dateDebut,
          date_fin: form.dateFin,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Impossible de déclarer le stage"
        );
      }

      navigate(`/etudiant/statut?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Styles object
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "1rem"
    },
    
    errorContainer: {
      background: "#fef2f2",
      color: "#dc2626",
      border: "1px solid #fecaca",
      padding: "0.875rem 1rem",
      borderRadius: "0.875rem",
      marginBottom: "1.5rem",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    
    errorIcon: {
      fontSize: "1rem",
      flexShrink: "0"
    },
    
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem"
    },
    
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "1rem"
    },
    
    gridColumns: {
      gridTemplateColumns: "1fr 1fr"
    },
    
    formGroup: {
      display: "flex",
      flexDirection: "column"
    },
    
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "0.5rem"
    },
    
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      backgroundColor: "#f9fafb",
      border: "1.5px solid #e5e7eb",
      borderRadius: "0.75rem",
      fontSize: "0.875rem",
      color: "#1f2937",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit"
    },
    
    inputFocus: {
      borderColor: "#f472b6",
      backgroundColor: "white",
      boxShadow: "0 0 0 3px rgba(244, 114, 182, 0.1)"
    },
    
    textarea: {
      resize: "none",
      minHeight: "100px",
      lineHeight: "1.5"
    },
    
    inputHover: {
      borderColor: "#d1d5db"
    },
    
    submitButton: {
      width: "100%",
      padding: "0.875rem",
      background: "linear-gradient(135deg, #db2777 0%, #f472b6 100%)",
      color: "white",
      border: "none",
      borderRadius: "0.75rem",
      fontSize: "0.875rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      marginTop: "0.5rem"
    },
    
    submitButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(219, 39, 119, 0.3)"
    },
    
    submitButtonDisabled: {
      opacity: "0.6",
      cursor: "not-allowed",
      transform: "none !important",
      boxShadow: "none !important"
    },
    
    backButton: {
      background: "none",
      border: "none",
      color: "#6b7280",
      fontSize: "0.875rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "color 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.25rem",
      padding: "0",
      marginTop: "0.5rem"
    },
    
    backButtonHover: {
      color: "#374151"
    },
    
    backIcon: {
      fontSize: "1rem"
    },
    
    loadingSpinner: {
      width: "1rem",
      height: "1rem",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTopColor: "white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    
    // Responsive styles
    responsive: {
      "@media (min-width: 768px)": {
        grid: {
          gridTemplateColumns: "1fr 1fr"
        }
      }
    }
  };

  // Helper function to merge styles
  const mergeStyles = (base, additional) => ({
    ...base,
    ...additional
  });

  return (
    <div style={styles.container}>
      {/* Add animation styles */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {error && (
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      <form 
        style={styles.form} 
        onSubmit={handleSubmit}
        onFocus={(e) => {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            e.target.style.borderColor = styles.inputFocus.borderColor;
            e.target.style.backgroundColor = styles.inputFocus.backgroundColor;
            e.target.style.boxShadow = styles.inputFocus.boxShadow;
          }
        }}
        onBlur={(e) => {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            e.target.style.borderColor = styles.input.border;
            e.target.style.backgroundColor = styles.input.backgroundColor;
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        <div style={mergeStyles(styles.grid, { 
          ...(window.innerWidth >= 768 && styles.gridColumns)
        })}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom</label>
            <input
              style={styles.input}
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Jean"
              required
              onMouseEnter={(e) => e.target.style.borderColor = styles.inputHover.borderColor}
              onMouseLeave={(e) => {
                if (e.target !== document.activeElement) {
                  e.target.style.borderColor = styles.input.border;
                }
              }}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Prénom</label>
            <input
              style={styles.input}
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Dupont"
              required
              onMouseEnter={(e) => e.target.style.borderColor = styles.inputHover.borderColor}
              onMouseLeave={(e) => {
                if (e.target !== document.activeElement) {
                  e.target.style.borderColor = styles.input.border;
                }
              }}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jean.dupont@exemple.com"
            required
            onMouseEnter={(e) => e.target.style.borderColor = styles.inputHover.borderColor}
            onMouseLeave={(e) => {
              if (e.target !== document.activeElement) {
                e.target.style.borderColor = styles.input.border;
              }
            }}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Entreprise</label>
          <input
            style={styles.input}
            type="text"
            name="entreprise"
            value={form.entreprise}
            onChange={handleChange}
            placeholder="Nom de l'entreprise"
            required
            onMouseEnter={(e) => e.target.style.borderColor = styles.inputHover.borderColor}
            onMouseLeave={(e) => {
              if (e.target !== document.activeElement) {
                e.target.style.borderColor = styles.input.border;
              }
            }}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Sujet du stage</label>
          <textarea
            style={mergeStyles(styles.input, styles.textarea)}
            name="sujet"
            value={form.sujet}
            onChange={handleChange}
            placeholder="Description du sujet du stage"
            rows={3}
            required
            onMouseEnter={(e) => e.target.style.borderColor = styles.inputHover.borderColor}
            onMouseLeave={(e) => {
              if (e.target !== document.activeElement) {
                e.target.style.borderColor = styles.input.border;
              }
            }}
          />
        </div>

        <div style={mergeStyles(styles.grid, { 
          ...(window.innerWidth >= 768 && styles.gridColumns)
        })}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date de début</label>
            <input
              style={styles.input}
              type="date"
              name="dateDebut"
              value={form.dateDebut}
              onChange={handleChange}
              required
              onMouseEnter={(e) => e.target.style.borderColor = styles.inputHover.borderColor}
              onMouseLeave={(e) => {
                if (e.target !== document.activeElement) {
                  e.target.style.borderColor = styles.input.border;
                }
              }}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Date de fin</label>
            <input
              style={styles.input}
              type="date"
              name="dateFin"
              value={form.dateFin}
              onChange={handleChange}
              required
              onMouseEnter={(e) => e.target.style.borderColor = styles.inputHover.borderColor}
              onMouseLeave={(e) => {
                if (e.target !== document.activeElement) {
                  e.target.style.borderColor = styles.input.border;
                }
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={mergeStyles(
            styles.submitButton,
            loading && styles.submitButtonDisabled
          )}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = styles.submitButtonHover.transform;
              e.currentTarget.style.boxShadow = styles.submitButtonHover.boxShadow;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          {loading ? (
            <>
              <div style={styles.loadingSpinner}></div>
              Envoi en cours...
            </>
          ) : (
            "Déclarer le stage"
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={styles.backButton}
          onMouseEnter={(e) => e.currentTarget.style.color = styles.backButtonHover.color}
          onMouseLeave={(e) => e.currentTarget.style.color = styles.backButton.color}
        >
          <span style={styles.backIcon}>←</span>
          Retour à l'accueil
        </button>
      </form>
    </div>
  );
}