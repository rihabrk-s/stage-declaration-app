export default function StatusBadge({ status }) {
  const map = {
    "en attente": "bg-yellow-100 text-yellow-800",
    "validé": "bg-green-100 text-green-800",
    "refusé": "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}
