import { useState } from "react";
import Button from "../components/Button";
import { declareStage } from "../services/api";

export default function DeclareStage() {
  const [form, setForm] = useState({
    id_etudiant: 1, // simulé
    entreprise: "",
    sujet: "",
    date_debut: "",
    date_fin: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await declareStage(form);
    alert("Déclaration envoyée !");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Déclaration de stage</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="entreprise" placeholder="Entreprise" onChange={handleChange} />
        <input name="sujet" placeholder="Sujet du stage" onChange={handleChange} />

        <div className="grid grid-cols-2 gap-3">
          <input type="date" name="date_debut" onChange={handleChange} />
          <input type="date" name="date_fin" onChange={handleChange} />
        </div>

        <Button>Soumettre</Button>
      </form>
    </div>
  );
}
