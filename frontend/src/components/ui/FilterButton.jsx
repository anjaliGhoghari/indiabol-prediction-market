function FilterButton({ label, active }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition
        ${
          active
            ? "bg-indigo-50 text-indigo-600 border-indigo-200"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
    >
      {label}
    </button>
  );
}
export default FilterButton;