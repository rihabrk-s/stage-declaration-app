import { useMemo } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = useMemo(() => {
    if (location.pathname.startsWith("/admin")) return "admin";
    return "student";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Gestion des Stages
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Plateforme de déclaration et de validation des stages
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-[#EEF2F7] rounded-full p-1 flex gap-1 w-full max-w-2xl">
            <button
              type="button"
              onClick={() => navigate("/etudiant/declaration")}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "student"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-700 hover:bg-white/70"
              }`}
            >
              🎓 Espace Étudiant
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/stages")}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "admin"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-700 hover:bg-white/70"
              }`}
            >
              🛡️ Espace Administration
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden">
          <div className="px-6 md:px-10 py-5 border-b border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900">
              {activeTab === "admin" ? "Espace Administration" : "Déclarer un stage"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === "admin"
                ? "Consulter les déclarations et les valider ou refuser."
                : "Remplissez le formulaire pour déclarer votre stage."}
            </p>
          </div>

          <div className="px-4 md:px-8 py-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
