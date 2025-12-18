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
          email: form.email,
          entreprise: form.entreprise,
          sujet: form.sujet,
          date_debut: form.dateDebut,
          date_fin: form.dateFin,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Impossible de déclarer le stage"
        );
      }

      navigate(`/etudiant/statut?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200";
  const label = "block text-sm font-semibold text-gray-800 mb-2";

  return (
    <div>
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-xl mb-5 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Nom</label>
            <input
              className={input}
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Jean"
              required
            />
          </div>
          <div>
            <label className={label}>Prénom</label>
            <input
              className={input}
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Dupont"
              required
            />
          </div>
        </div>

        <div>
          <label className={label}>Email</label>
          <input
            className={input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jean.dupont@exemple.com"
            required
          />
        </div>

        <div>
          <label className={label}>Entreprise</label>
          <input
            className={input}
            type="text"
            name="entreprise"
            value={form.entreprise}
            onChange={handleChange}
            placeholder="Nom de l'entreprise"
            required
          />
        </div>

        <div>
          <label className={label}>Sujet du stage</label>
          <textarea
            className={`${input} resize-none`}
            name="sujet"
            value={form.sujet}
            onChange={handleChange}
            placeholder="Description du sujet du stage"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Date de début</label>
            <input
              className={input}
              type="date"
              name="dateDebut"
              value={form.dateDebut}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className={label}>Date de fin</label>
            <input
              className={input}
              type="date"
              name="dateFin"
              value={form.dateFin}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Envoi..." : "Déclarer le stage"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          ← Retour à l’accueil
        </button>
      </form>
    </div>
  );
}
