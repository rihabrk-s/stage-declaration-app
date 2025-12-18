import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import StudentDeclare from "./pages/StudentDeclare";
import StudentStatus from "./pages/StudentStatus";
import AdminStages from "./pages/AdminStages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Home avec onglets */}
        <Route path="/" element={<Home />}>
          {/* Page par défaut : étudiant */}
          <Route index element={<Navigate to="/etudiant/declaration" replace />} />

          {/* Contenu affiché dans <Outlet /> */}
          <Route path="etudiant/declaration" element={<StudentDeclare />} />
          <Route path="admin/stages" element={<AdminStages />} />
        </Route>

        {/* Page statut étudiante hors layout */}
        <Route path="/etudiant/statut" element={<StudentStatus />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
