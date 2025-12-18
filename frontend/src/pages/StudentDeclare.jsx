// src/pages/StudentDeclare.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDeclare() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    entreprise: "",
    sujet: "",
    dateDebut: "",
    dateFin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
          email: form.email, // <-- ajouté
          entreprise: form.entreprise,
          sujet: form.sujet,
          date_debut: form.dateDebut,
          date_fin: form.dateFin,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Impossible de déclarer le stage");
      }

      navigate("/student-status");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-12">
        <h2 className="text-4xl font-extrabold text-brown-800 mb-10 text-center">
          Déclarez votre stage
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Nom / Prénom */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Nom"
              required
              className="flex-1 border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400 shadow-sm"
            />
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Prénom"
              required
              className="flex-1 border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400 shadow-sm"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400 shadow-sm"
          />

          {/* Entreprise */}
          <input
            type="text"
            name="entreprise"
            value={form.entreprise}
            onChange={handleChange}
            placeholder="Entreprise"
            required
            className="border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400 shadow-sm"
          />

          {/* Sujet */}
          <input
            type="text"
            name="sujet"
            value={form.sujet}
            onChange={handleChange}
            placeholder="Sujet du stage"
            required
            className="border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400 shadow-sm"
          />

          {/* Dates */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              name="dateDebut"
              value={form.dateDebut}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
            />
            <input
              type="date"
              name="dateFin"
              value={form.dateFin}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
            />
          </div>

          {/* Bouton principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-200 hover:bg-blue-300 text-brown-900 font-bold rounded-xl py-4 shadow-md transition duration-200 transform hover:scale-105 disabled:opacity-70"
          >
            {loading ? "Envoi..." : "Déclarer mon stage"}
          </button>
        </form>

        {/* Bouton retour */}
        <button
          onClick={() => navigate("/")}
          className="mt-8 w-full text-center text-blue-400 hover:underline font-medium"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
