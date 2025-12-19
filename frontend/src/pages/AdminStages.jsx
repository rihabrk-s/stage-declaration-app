import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { getAllStages, validateStage, refuseStage } from "../services/api";
import { useNavigate } from "react-router-dom";

function formatDate(d) {
  if (!d) return "-";
  // d peut être "2025-04-02T00:00:00.000Z" ou "2025-04-02"
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString("fr-FR");
}

export default function AdminStages() {
  const navigate = useNavigate();
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStages = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await getAllStages();
      setStages(list);
    } catch (e) {
      setStages([]);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStages();
  }, []);

  const onValidate = async (id) => {
    try {
      await validateStage(id);
      await loadStages();
    } catch (e) {
      alert(e.message);
    }
  };

  const onRefuse = async (id) => {
    try {
      await refuseStage(id);
      await loadStages();
    } catch (e) {
      alert(e.message);
    }
  };

  // Styles object
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto"
    },
    
    loadingText: {
      fontSize: "0.875rem",
      color: "#6b7280",
      textAlign: "center",
      padding: "2rem 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem"
    },
    
    loadingSpinner: {
      width: "1rem",
      height: "1rem",
      border: "2px solid #f3f4f6",
      borderTopColor: "#f472b6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
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
    
    emptyState: {
      fontSize: "0.875rem",
      color: "#6b7280",
      textAlign: "center",
      padding: "3rem 1rem",
      background: "#f9fafb",
      borderRadius: "1rem",
      border: "1px dashed #e5e7eb"
    },
    
    stagesList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem"
    },
    
    stageCard: {
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "1rem",
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      transition: "all 0.2s ease"
    },
    
    stageCardHover: {
      boxShadow: "0 4px 12px rgba(219, 39, 119, 0.08)",
      borderColor: "#fce7f3"
    },
    
    stageInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      flex: "1"
    },
    
    studentName: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#1f2937",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      flexWrap: "wrap"
    },
    
    separator: {
      color: "#9ca3af",
      fontWeight: "400"
    },
    
    studentEmail: {
      color: "#6b7280",
      fontWeight: "400"
    },
    
    infoRow: {
      fontSize: "0.875rem",
      color: "#4b5563",
      lineHeight: "1.4"
    },
    
    infoLabel: {
      fontWeight: "600",
      color: "#374151"
    },
    
    dateRow: {
      fontSize: "0.75rem",
      color: "#9ca3af",
      marginTop: "0.25rem"
    },
    
    actionsContainer: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "0.5rem"
    },
    
    validateButton: {
      padding: "0.5rem 1rem",
      background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      color: "white",
      border: "none",
      borderRadius: "0.75rem",
      fontSize: "0.75rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.375rem"
    },
    
    validateButtonHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)"
    },
    
    validateButtonDisabled: {
      background: "#f3f4f6",
      color: "#9ca3af",
      cursor: "not-allowed",
      transform: "none !important",
      boxShadow: "none !important"
    },
    
    refuseButton: {
      padding: "0.5rem 1rem",
      background: "white",
      color: "#ef4444",
      border: "1.5px solid #fca5a5",
      borderRadius: "0.75rem",
      fontSize: "0.75rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.375rem"
    },
    
    refuseButtonHover: {
      background: "#fef2f2",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.1)"
    },
    
    refuseButtonDisabled: {
      background: "#f3f4f6",
      color: "#9ca3af",
      borderColor: "#e5e7eb",
      cursor: "not-allowed",
      transform: "none !important",
      boxShadow: "none !important"
    },
    
    buttonGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginTop: "1.5rem",
      paddingTop: "1rem",
      borderTop: "1px solid #f3f4f6"
    },
    
    refreshButton: {
      padding: "0.5rem 1rem",
      background: "#f3f4f6",
      color: "#374151",
      border: "none",
      borderRadius: "0.75rem",
      fontSize: "0.75rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.375rem"
    },
    
    refreshButtonHover: {
      background: "#e5e7eb",
      transform: "translateY(-1px)"
    },
    
    backButton: {
      padding: "0.5rem 1rem",
      background: "#f3f4f6",
      color: "#374151",
      border: "none",
      borderRadius: "0.75rem",
      fontSize: "0.75rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.375rem"
    },
    
    backButtonHover: {
      background: "#e5e7eb",
      transform: "translateY(-1px)"
    },
    
    // Responsive styles
    responsive: {
      "@media (min-width: 768px)": {
        stageCard: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        },
        actionsContainer: {
          flexWrap: "nowrap"
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
      
      {loading && (
        <p style={styles.loadingText}>
          <div style={styles.loadingSpinner}></div>
          Chargement...
        </p>
      )}

      {error && (
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {!loading && !error && stages.length === 0 && (
        <div style={styles.emptyState}>
          <p style={{ marginBottom: "0.5rem" }}>📭</p>
          <p>Aucune déclaration de stage à afficher</p>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>
            Les déclarations apparaîtront ici une fois soumises par les étudiants
          </p>
        </div>
      )}

      {!loading && !error && stages.length > 0 && (
        <div style={styles.stagesList}>
          {stages.map((s) => {
            const statut = (s.statut || "en_attente").toLowerCase();
            const disabledValidate = statut === "valide";
            const disabledRefuse = statut === "refuse";

            return (
              <div
                key={s.id}
                style={styles.stageCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = styles.stageCardHover.boxShadow;
                  e.currentTarget.style.borderColor = styles.stageCardHover.borderColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = styles.stageCard.border;
                }}
              >
                <div style={styles.stageInfo}>
                  <p style={styles.studentName}>
                    {s.nom ? s.nom : `Étudiant #${s.id_etudiant}`}
                    <span style={styles.separator}>•</span>
                    <span style={styles.studentEmail}>
                      {s.email || "-"}
                    </span>
                  </p>

                  <p style={styles.infoRow}>
                    <span style={styles.infoLabel}>Entreprise :</span>{" "}
                    {s.entreprise}
                  </p>

                  <p style={styles.infoRow}>
                    <span style={styles.infoLabel}>Sujet :</span> {s.sujet}
                  </p>

                  <p style={styles.dateRow}>
                    {formatDate(s.date_debut)} → {formatDate(s.date_fin)}
                  </p>
                </div>

                <div style={styles.actionsContainer}>
                  <StatusBadge status={s.statut} />
                  
                  <button
                    onClick={() => onValidate(s.id)}
                    disabled={disabledValidate}
                    style={mergeStyles(
                      styles.validateButton,
                      disabledValidate && styles.validateButtonDisabled
                    )}
                    type="button"
                    onMouseEnter={(e) => {
                      if (!disabledValidate) {
                        e.currentTarget.style.transform = styles.validateButtonHover.transform;
                        e.currentTarget.style.boxShadow = styles.validateButtonHover.boxShadow;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!disabledValidate) {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    ✅ Valider
                  </button>

                  <button
                    onClick={() => onRefuse(s.id)}
                    disabled={disabledRefuse}
                    style={mergeStyles(
                      styles.refuseButton,
                      disabledRefuse && styles.refuseButtonDisabled
                    )}
                    type="button"
                    onMouseEnter={(e) => {
                      if (!disabledRefuse) {
                        e.currentTarget.style.transform = styles.refuseButtonHover.transform;
                        e.currentTarget.style.boxShadow = styles.refuseButtonHover.boxShadow;
                        e.currentTarget.style.background = styles.refuseButtonHover.background;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!disabledRefuse) {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.background = styles.refuseButton.background;
                      }
                    }}
                  >
                    ❌ Refuser
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={styles.buttonGroup}>
        <button
          onClick={loadStages}
          style={styles.refreshButton}
          type="button"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = styles.refreshButtonHover.background;
            e.currentTarget.style.transform = styles.refreshButtonHover.transform;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = styles.refreshButton.background;
            e.currentTarget.style.transform = "none";
          }}
        >
          🔄 Rafraîchir
        </button>

        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
          type="button"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = styles.backButtonHover.background;
            e.currentTarget.style.transform = styles.backButtonHover.transform;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = styles.backButton.background;
            e.currentTarget.style.transform = "none";
          }}
        >
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
}