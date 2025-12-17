import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { getStudentStage } from "../services/api";

export default function StudentStatus() {
  const [stage, setStage] = useState(null);

  useEffect(() => {
    getStudentStage(1).then(setStage);
  }, []);

  if (!stage) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Suivi de votre stage</h2>

      <p><strong>Entreprise :</strong> {stage.entreprise}</p>
      <p><strong>Sujet :</strong> {stage.sujet}</p>

      <div className="mt-4">
        <StatusBadge status={stage.statut} />
      </div>
    </div>
  );
}
