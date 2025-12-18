// frontend/src/services/api.js
const API_URL = "http://localhost:4000/api";

// ========== ÉTUDIANT ==========
export async function declareStage(data) {
  const res = await fetch(`${API_URL}/stages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || json.error || "Erreur déclaration");
  return json; // { stage: ... }
}

// ✅ Récupérer les stages d'un étudiant par email
// Backend supporte: GET /api/stages?email=...
export async function getStudentStagesByEmail(email) {
  const res = await fetch(
    `${API_URL}/stages?email=${encodeURIComponent(email)}`
  );

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Erreur récupération stages");
  return json.stages || []; // [...]
}

// ========== ADMIN ==========
export async function getAllStages() {
  const res = await fetch(`${API_URL}/stages`);

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Erreur chargement stages");
  return json.stages || []; // ✅ retourne directement la liste
}

export async function validateStage(id) {
  const res = await fetch(`${API_URL}/stages/${id}/validate`, { method: "PUT" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Erreur validation");
  return json; // { stage: ... }
}

export async function refuseStage(id) {
  const res = await fetch(`${API_URL}/stages/${id}/refuse`, { method: "PUT" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Erreur refus");
  return json; // { stage: ... }
}