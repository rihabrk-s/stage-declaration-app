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

  return (
    <div>
      {/* ⚠️ Plus de min-h-screen / gros titre : Home s’en occupe */}
      {loading && <p className="text-sm text-gray-500">Chargement...</p>}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-xl mb-5 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && stages.length === 0 && (
        <p className="text-sm text-gray-500">Aucune déclaration.</p>
      )}

      {!loading && !error && stages.length > 0 && (
        <div className="space-y-3">
          {stages.map((s) => {
            const statut = (s.statut || "en_attente").toLowerCase();
            const disabledValidate = statut === "valide";
            const disabledRefuse = statut === "refuse";

            return (
              <div
                key={s.id}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">
                    {s.nom ? s.nom : `Étudiant #${s.id_etudiant}`}
                    <span className="text-gray-400 font-normal"> • </span>
                    <span className="text-gray-600 font-normal">
                      {s.email || "-"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Entreprise :</span>{" "}
                    {s.entreprise}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Sujet :</span> {s.sujet}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDate(s.date_debut)} → {formatDate(s.date_fin)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={s.statut} />

                  <button
                    onClick={() => onValidate(s.id)}
                    disabled={disabledValidate}
                    className={`px-4 py-2 rounded-xl font-semibold transition
                      ${
                        disabledValidate
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    type="button"
                  >
                    Valider
                  </button>

                  <button
                    onClick={() => onRefuse(s.id)}
                    disabled={disabledRefuse}
                    className={`px-4 py-2 rounded-xl font-semibold transition
                      ${
                        disabledRefuse
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-100"
                      }`}
                    type="button"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={loadStages}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
          type="button"
        >
          Rafraîchir
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
          type="button"
        >
          ← Retour
        </button>
      </div>
    </div>
  );
}
