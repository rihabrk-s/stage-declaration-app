// src/pages/StudentDeclare.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDeclare() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    entreprise: "",
    sujet: "",
    dateDebut: "",
    dateFin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
          entreprise: form.entreprise,
          sujet: form.sujet,
          date_debut: form.dateDebut,
          date_fin: form.dateFin,
        }),
      });

      if (!response.ok) throw new Error("Impossible de déclarer le stage");

      navigate("/student-status");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10">
        <h2 className="text-3xl font-bold text-brown-800 mb-8 text-center">
          Déclarez votre stage
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/** Nom / Prénom */}
          <div className="flex gap-4">
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Nom"
              required
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
            />
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Prénom"
              required
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
            />
          </div>

          {/** Entreprise */}
          <input
            type="text"
            name="entreprise"
            value={form.entreprise}
            onChange={handleChange}
            placeholder="Entreprise"
            required
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
          />

          {/** Sujet */}
          <input
            type="text"
            name="sujet"
            value={form.sujet}
            onChange={handleChange}
            placeholder="Sujet du stage"
            required
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
          />

          {/** Dates */}
          <div className="flex gap-4">
            <input
              type="date"
              name="dateDebut"
              value={form.dateDebut}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="date"
              name="dateFin"
              value={form.dateFin}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/** Bouton principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-200 hover:bg-blue-300 text-brown-900 font-semibold rounded-lg py-3 shadow-md transition duration-200 hover:scale-105"
          >
            {loading ? "Envoi..." : "Déclarer mon stage"}
          </button>
        </form>

        {/** Bouton retour */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full text-center text-blue-400 hover:underline font-medium"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
