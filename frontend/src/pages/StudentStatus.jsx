import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { getStudentStagesByEmail } from "../services/api";

export default function StudentStatus() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const email = new URLSearchParams(search).get("email");

  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (!email) throw new Error("Email manquant.");

        const stages = await getStudentStagesByEmail(email);
        const stageData = stages?.[0];

        if (!stageData) throw new Error(`Aucune déclaration trouvée pour ${email}`);

        setStage(stageData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [email]);

  // Styles object
  const styles = {
    container: {
      maxWidth: "500px",
      margin: "0 auto",
      padding: "1rem"
    },
    
    loadingContainer: {
      textAlign: "center",
      padding: "3rem 1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem"
    },
    
    loadingSpinner: {
      width: "3rem",
      height: "3rem",
      border: "3px solid #f3f4f6",
      borderTopColor: "#f472b6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    
    loadingText: {
      fontSize: "1rem",
      color: "#6b7280",
      fontWeight: "500"
    },
    
    errorContainer: {
      background: "white",
      borderRadius: "1rem",
      padding: "2rem",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      maxWidth: "500px",
      margin: "0 auto",
      textAlign: "center",
      border: "1px solid #fce7f3"
    },
    
    errorIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      color: "#f472b6"
    },
    
    errorMessage: {
      color: "#dc2626",
      fontSize: "1rem",
      marginBottom: "1.5rem",
      lineHeight: "1.5"
    },
    
    backButton: {
      background: "none",
      border: "none",
      color: "#f472b6",
      fontSize: "0.875rem",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "underline",
      transition: "color 0.2s ease",
      padding: "0",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.25rem"
    },
    
    backButtonHover: {
      color: "#db2777"
    },
    
    backIcon: {
      fontSize: "1rem"
    },
    
    statusCard: {
      background: "white",
      borderRadius: "1.25rem",
      padding: "2rem",
      boxShadow: "0 8px 32px rgba(219, 39, 119, 0.1)",
      border: "1px solid #fce7f3",
      maxWidth: "500px",
      margin: "0 auto"
    },
    
    statusHeader: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      marginBottom: "1.5rem",
      paddingBottom: "1rem",
      borderBottom: "2px solid #fdf2f8"
    },
    
    statusIcon: {
      fontSize: "1.5rem",
      color: "#f472b6"
    },
    
    statusTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#1f2937",
      margin: "0"
    },
    
    infoGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginBottom: "1.5rem"
    },
    
    infoRow: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem"
    },
    
    infoLabel: {
      fontSize: "0.75rem",
      fontWeight: "600",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    },
    
    infoValue: {
      fontSize: "1rem",
      color: "#1f2937",
      fontWeight: "500",
      lineHeight: "1.4"
    },
    
    emailValue: {
      color: "#f472b6",
      fontWeight: "600",
      wordBreak: "break-all"
    },
    
    badgeContainer: {
      padding: "1.5rem",
      background: "#fdf2f8",
      borderRadius: "1rem",
      border: "1px solid #fbcfe8",
      marginTop: "1rem",
      marginBottom: "1.5rem",
      textAlign: "center"
    },
    
    badgeLabel: {
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#6b7280",
      marginBottom: "0.5rem"
    },
    
    footer: {
      marginTop: "1.5rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid #f3f4f6",
      display: "flex",
      justifyContent: "center"
    },
    
    homeButton: {
      padding: "0.75rem 1.5rem",
      background: "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
      color: "white",
      border: "none",
      borderRadius: "0.75rem",
      fontSize: "0.875rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    
    homeButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(219, 39, 119, 0.3)"
    },
    
    homeIcon: {
      fontSize: "1rem"
    }
  };

  // Helper function to merge styles
  const mergeStyles = (base, additional) => ({
    ...base,
    ...additional
  });

  if (loading) {
    return (
      <div style={styles.container}>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Chargement de votre statut...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorMessage}>{error}</p>
          <button
            style={styles.backButton}
            onClick={() => navigate("/etudiant/declaration")}
            onMouseEnter={(e) => e.currentTarget.style.color = styles.backButtonHover.color}
            onMouseLeave={(e) => e.currentTarget.style.color = styles.backButton.color}
          >
            <span style={styles.backIcon}>←</span>
            Retour à la déclaration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.statusCard}>
        {/* Header */}
        <div style={styles.statusHeader}>
          <span style={styles.statusIcon}>📋</span>
          <h2 style={styles.statusTitle}>Suivi de votre stage</h2>
        </div>

        {/* Information Grid */}
        <div style={styles.infoGrid}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Email</span>
            <span style={mergeStyles(styles.infoValue, styles.emailValue)}>
              {email}
            </span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Entreprise</span>
            <span style={styles.infoValue}>{stage.entreprise}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Sujet du stage</span>
            <span style={styles.infoValue}>{stage.sujet}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div style={styles.badgeContainer}>
          <div style={styles.badgeLabel}>Statut actuel</div>
          <StatusBadge status={stage.statut} />
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button
            style={styles.homeButton}
            onClick={() => navigate("/")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.homeButtonHover.transform;
              e.currentTarget.style.boxShadow = styles.homeButtonHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={styles.homeIcon}>🏠</span>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}