import React, { useMemo } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = useMemo(() => {
    if (location.pathname.startsWith("/admin")) return "admin";
    return "student";
  }, [location.pathname]);

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdf2f8 0%, #ffffff 50%, #fff5f7 100%)",
      padding: "2rem 1rem",
      position: "relative",
      overflowX: "hidden"
    },
    
    backgroundBlobs: {
      blob1: {
        position: "fixed",
        top: "10%",
        left: "10%",
        width: "20rem",
        height: "20rem",
        background: "linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        opacity: "0.2",
        zIndex: "0"
      },
      blob2: {
        position: "fixed",
        bottom: "10%",
        right: "10%",
        width: "25rem",
        height: "25rem",
        background: "linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        opacity: "0.15",
        zIndex: "0"
      }
    },
    
    contentWrapper: {
      maxWidth: "72rem",
      margin: "0 auto",
      position: "relative",
      zIndex: "1"
    },
    
    header: {
      textAlign: "center",
      marginBottom: "3rem"
    },
    
    headerIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "5rem",
      height: "5rem",
      background: "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
      borderRadius: "1.25rem",
      boxShadow: "0 10px 25px rgba(244, 114, 182, 0.3)",
      marginBottom: "1.5rem",
      transition: "transform 0.3s ease"
    },
    
    headerIconHover: {
      transform: "scale(1.05)"
    },
    
    iconText: {
      fontSize: "2rem"
    },
    
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#1f2937",
      letterSpacing: "-0.025em",
      marginBottom: "0.75rem",
      lineHeight: "1.2"
    },
    
    titleAccent: {
      background: "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    },
    
    subtitle: {
      fontSize: "1.125rem",
      color: "#4b5563",
      fontWeight: "500",
      maxWidth: "36rem",
      margin: "0 auto 1.5rem",
      lineHeight: "1.6"
    },
    
    titleDecoration: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      marginTop: "1rem"
    },
    
    decorationLine: {
      height: "2px",
      width: "4rem",
      borderRadius: "1px"
    },
    
    decorationLineLeft: {
      background: "linear-gradient(90deg, #f472b6 0%, #f9a8d4 100%)"
    },
    
    decorationDot: {
      width: "0.5rem",
      height: "0.5rem",
      backgroundColor: "#f472b6",
      borderRadius: "50%"
    },
    
    decorationLineRight: {
      background: "linear-gradient(90deg, #f9a8d4 0%, #f472b6 100%)"
    },
    
    tabNavigation: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "3rem"
    },
    
    tabContainer: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "1rem",
      padding: "0.5rem",
      boxShadow: "0 10px 25px rgba(251, 207, 232, 0.3)",
      border: "1px solid #fce7f3",
      display: "flex",
      gap: "0.5rem",
      width: "100%",
      maxWidth: "32rem"
    },
    
    tabButton: {
      flex: "1",
      borderRadius: "0.75rem",
      padding: "1rem 1.75rem",
      fontSize: "0.875rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      border: "none",
      cursor: "pointer",
      outline: "none"
    },
    
    tabButtonInactive: {
      color: "#4b5563",
      background: "transparent"
    },
    
    tabButtonInactiveHover: {
      background: "#fdf2f8",
      color: "#1f2937",
      border: "1px solid #fbcfe8"
    },
    
    tabButtonActive: {
      color: "white",
      boxShadow: "0 8px 20px rgba(219, 39, 119, 0.25)"
    },
    
    studentTabActive: {
      background: "linear-gradient(135deg, #db2777 0%, #f472b6 100%)"
    },
    
    adminTabActive: {
      background: "linear-gradient(135deg, #374151 0%, #111827 100%)"
    },
    
    tabIcon: {
      fontSize: "1.25rem",
      transition: "transform 0.3s ease"
    },
    
    tabIconActive: {
      transform: "scale(1.1)"
    },
    
    tabLabel: {
      position: "relative"
    },
    
    activeIndicator: {
      position: "absolute",
      bottom: "-0.25rem",
      left: "0",
      width: "100%",
      height: "2px",
      background: "rgba(255, 255, 255, 0.5)",
      borderRadius: "1px"
    },
    
    contentCard: {
      background: "white",
      borderRadius: "1.5rem",
      boxShadow: "0 20px 40px rgba(251, 207, 232, 0.2)",
      border: "1px solid #fce7f3",
      overflow: "hidden",
      transition: "box-shadow 0.3s ease",
      marginBottom: "2.5rem"
    },
    
    contentCardHover: {
      boxShadow: "0 25px 50px rgba(251, 207, 232, 0.3)"
    },
    
    cardHeader: {
      padding: "1.75rem 2rem",
      borderBottom: "1px solid #fce7f3",
      background: "linear-gradient(90deg, #fdf2f8 0%, #fce7f3 50%)"
    },
    
    headerContent: {
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    },
    
    accentBar: {
      width: "3px",
      height: "2.5rem",
      borderRadius: "1.5px"
    },
    
    accentBarStudent: {
      background: "linear-gradient(180deg, #db2777 0%, #f472b6 100%)",
      boxShadow: "0 0 10px rgba(219, 39, 119, 0.3)"
    },
    
    accentBarAdmin: {
      background: "linear-gradient(180deg, #374151 0%, #111827 100%)"
    },
    
    headerDetails: {
      flex: "1",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "1rem"
    },
    
    headerTitleSection: {
      flex: "1"
    },
    
    cardTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "0.5rem",
      lineHeight: "1.3"
    },
    
    cardSubtitle: {
      fontSize: "0.875rem",
      color: "#6b7280",
      lineHeight: "1.5"
    },
    
    userBadge: {
      padding: "0.375rem 1rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "600",
      whiteSpace: "nowrap"
    },
    
    userBadgeStudent: {
      background: "#fce7f3",
      color: "#be185d"
    },
    
    userBadgeAdmin: {
      background: "#f3f4f6",
      color: "#374151"
    },
    
    contentArea: {
      padding: "2.5rem 1.5rem",
      background: "linear-gradient(180deg, #ffffff 0%, #fdf2f8 100%)"
    },
    
    contentWrapper: {
      maxWidth: "64rem",
      margin: "0 auto",
      position: "relative"
    },
    
    cornerAccent: {
      position: "absolute",
      width: "1.5rem",
      height: "1.5rem",
      borderRadius: "0.25rem"
    },
    
    cornerTopLeft: {
      top: "-0.75rem",
      left: "-0.75rem",
      borderTop: "2px solid #f9a8d4",
      borderLeft: "2px solid #f9a8d4"
    },
    
    cornerTopRight: {
      top: "-0.75rem",
      right: "-0.75rem",
      borderTop: "2px solid #f472b6",
      borderRight: "2px solid #f472b6"
    },
    
    cornerBottomLeft: {
      bottom: "-0.75rem",
      left: "-0.75rem",
      borderBottom: "2px solid #f472b6",
      borderLeft: "2px solid #f472b6"
    },
    
    cornerBottomRight: {
      bottom: "-0.75rem",
      right: "-0.75rem",
      borderBottom: "2px solid #f9a8d4",
      borderRight: "2px solid #f9a8d4"
    },
    
    cardFooter: {
      padding: "1.25rem 2rem",
      borderTop: "1px solid #fce7f3",
      background: "linear-gradient(90deg, #fdf2f8 30%, #fce7f3 100%)"
    },
    
    footerContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem"
    },
    
    securityStatus: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    
    statusIndicator: {
      width: "0.5rem",
      height: "0.5rem",
      borderRadius: "50%",
      backgroundColor: "#db2777",
      animation: "pulse 2s infinite"
    },
    
    statusText: {
      fontSize: "0.75rem",
      color: "#6b7280",
      fontWeight: "500"
    },
    
    timeEstimation: {
      display: "flex",
      alignItems: "center",
      gap: "0.375rem"
    },
    
    timeIcon: {
      fontSize: "0.875rem"
    },
    
    timeText: {
      fontSize: "0.75rem",
      color: "#6b7280",
      fontWeight: "500"
    },
    
    platformInfo: {
      textAlign: "center"
    },
    
    platformBadges: {
      display: "inline-flex",
      alignItems: "center",
      gap: "1.5rem",
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(4px)",
      borderRadius: "1rem",
      padding: "1rem 2rem",
      boxShadow: "0 8px 20px rgba(251, 207, 232, 0.2)",
      border: "1px solid #fce7f3",
      marginBottom: "2rem"
    },
    
    badgeItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    
    badgeDot: {
      width: "0.75rem",
      height: "0.75rem",
      borderRadius: "50%"
    },
    
    badgeDotSecure: {
      backgroundColor: "#db2777"
    },
    
    badgeDotRgpd: {
      backgroundColor: "#f472b6"
    },
    
    badgeDotSupport: {
      backgroundColor: "#f9a8d4"
    },
    
    badgeText: {
      fontSize: "0.75rem",
      fontWeight: "600",
      color: "#374151"
    },
    
    badgeSeparator: {
      width: "1px",
      height: "1.5rem",
      backgroundColor: "#fce7f3"
    },
    
    copyright: {
      fontSize: "0.75rem",
      color: "#9ca3af",
      letterSpacing: "0.025em"
    },
    
    separator: {
      margin: "0 0.5rem"
    },
    
    // Animation keyframes
    pulseAnimation: {
      "@keyframes pulse": {
        "0%, 100%": {
          opacity: 1
        },
        "50%": {
          opacity: 0.5
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
      {/* Add pulse animation styles */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      
      {/* Background blobs */}
      <div style={styles.backgroundBlobs.blob1} />
      <div style={styles.backgroundBlobs.blob2} />
      
      <div style={styles.contentWrapper}>
        {/* Header Section */}
        <header style={styles.header}>
          <div 
            style={styles.headerIcon}
            onMouseEnter={(e) => e.currentTarget.style.transform = styles.headerIconHover.transform}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <span style={styles.iconText}>📋</span>
          </div>
          <h1 style={styles.title}>
            Gestion des <span style={styles.titleAccent}>Stages</span>
          </h1>
          <p style={styles.subtitle}>
            Plateforme professionnelle de déclaration et validation des stages
          </p>
          <div style={styles.titleDecoration}>
            <div style={mergeStyles(styles.decorationLine, styles.decorationLineLeft)}></div>
            <div style={styles.decorationDot}></div>
            <div style={mergeStyles(styles.decorationLine, styles.decorationLineRight)}></div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav style={styles.tabNavigation}>
          <div style={styles.tabContainer}>
            <button
              type="button"
              onClick={() => navigate("/etudiant/declaration")}
              style={mergeStyles(
                styles.tabButton,
                activeTab === "student" 
                  ? mergeStyles(styles.tabButtonActive, styles.studentTabActive)
                  : styles.tabButtonInactive
              )}
              onMouseEnter={(e) => {
                if (activeTab !== "student") {
                  e.currentTarget.style.background = styles.tabButtonInactiveHover.background;
                  e.currentTarget.style.color = styles.tabButtonInactiveHover.color;
                  e.currentTarget.style.border = styles.tabButtonInactiveHover.border;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "student") {
                  e.currentTarget.style.background = styles.tabButtonInactive.background;
                  e.currentTarget.style.color = styles.tabButtonInactive.color;
                  e.currentTarget.style.border = "none";
                }
              }}
            >
              <span 
                style={mergeStyles(
                  styles.tabIcon,
                  activeTab === "student" && styles.tabIconActive
                )}
              >
                🎓
              </span>
              <span style={styles.tabLabel}>
                Espace Étudiant
                {activeTab === "student" && (
                  <span style={styles.activeIndicator}></span>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/stages")}
              style={mergeStyles(
                styles.tabButton,
                activeTab === "admin" 
                  ? mergeStyles(styles.tabButtonActive, styles.adminTabActive)
                  : styles.tabButtonInactive
              )}
              onMouseEnter={(e) => {
                if (activeTab !== "admin") {
                  e.currentTarget.style.background = styles.tabButtonInactiveHover.background;
                  e.currentTarget.style.color = styles.tabButtonInactiveHover.color;
                  e.currentTarget.style.border = styles.tabButtonInactiveHover.border;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "admin") {
                  e.currentTarget.style.background = styles.tabButtonInactive.background;
                  e.currentTarget.style.color = styles.tabButtonInactive.color;
                  e.currentTarget.style.border = "none";
                }
              }}
            >
              <span 
                style={mergeStyles(
                  styles.tabIcon,
                  activeTab === "admin" && styles.tabIconActive
                )}
              >
                🛡️
              </span>
              <span style={styles.tabLabel}>
                Espace Administration
                {activeTab === "admin" && (
                  <span style={styles.activeIndicator}></span>
                )}
              </span>
            </button>
          </div>
        </nav>

        {/* Content Card */}
        <main 
          style={styles.contentCard}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = styles.contentCardHover.boxShadow}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = styles.contentCard.boxShadow}
        >
          {/* Card Header */}
          <div style={styles.cardHeader}>
            <div style={styles.headerContent}>
              <div style={mergeStyles(
                styles.accentBar,
                activeTab === "admin" ? styles.accentBarAdmin : styles.accentBarStudent
              )}></div>
              <div style={styles.headerDetails}>
                <div style={styles.headerTitleSection}>
                  <h2 style={styles.cardTitle}>
                    {activeTab === "admin" ? "Espace Administration" : "Déclarer un stage"}
                  </h2>
                  <p style={styles.cardSubtitle}>
                    {activeTab === "admin"
                      ? "Consultez, gérez et validez les déclarations de stage des étudiants."
                      : "Remplissez le formulaire ci-dessous pour déclarer votre nouveau stage."}
                  </p>
                </div>
                <div style={mergeStyles(
                  styles.userBadge,
                  activeTab === "admin" ? styles.userBadgeAdmin : styles.userBadgeStudent
                )}>
                  {activeTab === "admin" ? "Administrateur" : "Étudiant"}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div style={styles.contentArea}>
            <div style={styles.contentWrapper}>
              {/* Decorative corner accents */}
              <div style={mergeStyles(styles.cornerAccent, styles.cornerTopLeft)}></div>
              <div style={mergeStyles(styles.cornerAccent, styles.cornerTopRight)}></div>
              <div style={mergeStyles(styles.cornerAccent, styles.cornerBottomLeft)}></div>
              <div style={mergeStyles(styles.cornerAccent, styles.cornerBottomRight)}></div>
              
              <Outlet />
            </div>
          </div>

          {/* Footer Note */}
          <div style={styles.cardFooter}>
            <div style={styles.footerContent}>
              <div style={styles.securityStatus}>
                <div style={styles.statusIndicator}></div>
                <span style={styles.statusText}>
                  {activeTab === "admin"
                    ? "Sécurité : accès restreint aux administrateurs"
                    : "Vos données sont protégées et chiffrées"}
                </span>
              </div>
              <div style={styles.timeEstimation}>
                <span style={styles.timeIcon}>🕒</span>
                <span style={styles.timeText}>
                  Temps estimé : {activeTab === "admin" ? "3-5 min" : "10-15 min"}
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Platform Info */}
        <footer style={styles.platformInfo}>
          <div style={styles.platformBadges}>
            <div style={styles.badgeItem}>
              <div style={mergeStyles(styles.badgeDot, styles.badgeDotSecure)}></div>
              <span style={styles.badgeText}>Sécurisé SSL</span>
            </div>
            <div style={styles.badgeSeparator}></div>
            <div style={styles.badgeItem}>
              <div style={mergeStyles(styles.badgeDot, styles.badgeDotRgpd)}></div>
              <span style={styles.badgeText}>RGPD Compliant</span>
            </div>
            <div style={styles.badgeSeparator}></div>
            <div style={styles.badgeItem}>
              <div style={mergeStyles(styles.badgeDot, styles.badgeDotSupport)}></div>
              <span style={styles.badgeText}>24/7 Support</span>
            </div>
          </div>
          
          <p style={styles.copyright}>
            © {new Date().getFullYear()} Gestion des Stages • 
            <span style={styles.separator}>•</span>
            Plateforme professionnelle certifiée
            <span style={styles.separator}>•</span>
            v2.1.0
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;