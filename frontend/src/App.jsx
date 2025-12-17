import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudentDeclare from "./pages/StudentDeclare";
import StudentStatus from "./pages/StudentStatus";
import AdminStages from "./pages/AdminStages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Étudiant */}
        <Route path="/etudiant/declaration" element={<StudentDeclare />} />
        <Route path="/etudiant/statut" element={<StudentStatus />} />

        {/* Administration */}
        <Route path="/admin/stages" element={<AdminStages />} />
      </Routes>
    </BrowserRouter>
  );
}
