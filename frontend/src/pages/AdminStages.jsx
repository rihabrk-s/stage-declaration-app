import { useEffect, useState } from "react";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { getAllStages, validateStage, refuseStage } from "../services/api";

export default function AdminStages() {
  const [stages, setStages] = useState([]);

  useEffect(() => {
    getAllStages().then(setStages);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-semibold">Déclarations de stage</h1>

      {stages.map((s) => (
        <div key={s.id} className="bg-white p-5 rounded-lg shadow-sm flex justify-between">
          <div>
            <p className="font-medium">Étudiant #{s.id_etudiant}</p>
            <p className="text-sm text-gray-600">{s.entreprise}</p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={s.statut} />
            <Button onClick={() => validateStage(s.id)}>Valider</Button>
            <Button variant="danger" onClick={() => refuseStage(s.id)}>Refuser</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
