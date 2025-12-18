export default function StatusBadge({ status }) {
  const s = (status || "en_attente").toLowerCase();

  if (s === "valide") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
        ✅ Validé
      </span>
    );
  }
  if (s === "refuse") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
        ❌ Refusé
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
      ⏳ En attente
    </span>
  );
}
