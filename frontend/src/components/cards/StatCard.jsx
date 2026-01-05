export default function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
