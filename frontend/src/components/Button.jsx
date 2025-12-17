export default function Button({ children, variant = "primary", ...props }) {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition";

  const variants = {
    primary: "bg-green-800 text-white hover:bg-green-900",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
