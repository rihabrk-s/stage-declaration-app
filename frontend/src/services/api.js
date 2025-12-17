const API_URL = "http://localhost:4000/api";

// ========== ÉTUDIANT ==========
export async function declareStage(data) {
  const res = await fetch(`${API_URL}/stages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getStudentStage(studentId) {
  const res = await fetch(`${API_URL}/stages/student/${studentId}`);
  return res.json();
}

// ========== ADMIN ==========
export async function getAllStages() {
  const res = await fetch(`${API_URL}/stages`);
  return res.json();
}

export async function validateStage(id) {
  return fetch(`${API_URL}/stages/${id}/validate`, { method: "PUT" });
}

export async function refuseStage(id) {
  return fetch(`${API_URL}/stages/${id}/refuse`, { method: "PUT" });
}
