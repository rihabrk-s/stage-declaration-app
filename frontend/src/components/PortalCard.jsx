export default function PortalCard({ title, description, action, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl shadow-md border border-gray-200
                 hover:shadow-lg transition p-6 flex flex-col justify-between"
    >
      <div>
        <h2 className={`text-xl font-semibold mb-2 ${color}`}>
          {title}
        </h2>
        <p className="text-gray-600 text-sm">
          {description}
        </p>
      </div>

      <div className={`mt-6 font-medium ${color}`}>
        Accéder →
      </div>
    </div>
  );
}
