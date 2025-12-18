import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

export default function StudentStatus() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const email = new URLSearchParams(search).get("email");

  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        if (!email) throw new Error("Email manquant.");

        const res = await fetch(
          `http://localhost:4000/api/stages/student?email=${encodeURIComponent(email)}`
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data?.message || "Erreur serveur");

        // ✅ CORRECTION ICI
        const stageData = data?.stages?.[0];

        if (!stageData) {
          throw new Error(`Aucune déclaration trouvée pour ${email}`);
        }

        setStage(stageData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [email]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
        <p className="text-red-600">{error}</p>
        <button
          className="mt-4 underline text-blue-500"
          onClick={() => navigate("/etudiant/declaration")}
        >
          Retour à la déclaration
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Suivi de votre stage</h2>

      <p><strong>Email :</strong> {email}</p>
      <p><strong>Entreprise :</strong> {stage.entreprise}</p>
      <p><strong>Sujet :</strong> {stage.sujet}</p>

      <div className="mt-4">
        <StatusBadge status={stage.statut} />
      </div>

      <button
        className="mt-6 underline text-blue-500"
        onClick={() => navigate("/")}
      >
        Retour à l’accueil
      </button>
    </div>
  );
}
