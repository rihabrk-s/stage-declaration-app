export default function StatusBadge({ status }) {
  // sécurité : si status est vide
  if (!status) {
    return (
      <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
        Inconnu
      </span>
    );
  }

  const normalized = status.toLowerCase();

  let label = "Inconnu";
  let classes = "bg-gray-200 text-gray-700";

  if (normalized === "en_attente") {
    label = "En attente";
    classes = "bg-yellow-100 text-yellow-800";
  } else if (normalized === "valide") {
    label = "Validé";
    classes = "bg-green-100 text-green-800";
  } else if (normalized === "refuse") {
    label = "Refusé";
    classes = "bg-red-100 text-red-800";
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
