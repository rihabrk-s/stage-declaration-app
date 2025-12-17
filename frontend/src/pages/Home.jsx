import { useNavigate } from "react-router-dom";
import PortalCard from "../components/PortalCard";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F5F3EF]">
      <div className="max-w-4xl mx-auto px-6">
        
        <h1 className="text-3xl font-semibold text-center mb-4 text-[#6B4F3F]">
          Déclaration & Suivi de Stages
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Mini-plateforme académique pour la gestion des stages
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <PortalCard
            title="Espace Étudiant"
            description="Déclarer votre stage et consulter le statut de validation."
            color="text-[#8FB9C8]"
            onClick={() => navigate("/etudiant/declaration")}
          />

          <PortalCard
            title="Espace Administration"
            description="Consulter les déclarations de stage et les valider ou refuser."
            color="text-[#6B4F3F]"
            onClick={() => navigate("/admin/stages")}
          />

        </div>
      </div>
    </div>
  );
}
