export default function MarketCard({
  question,
  status,
  endsIn,
  yesPool,
  noPool,
  onClick,
  category,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium
            ${
              status === "OPEN"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          {status}
        </span>
        <div>
          <span className="text-xs bg-blue-200 px-2 py-1 rounded-full text-gray-500">{category}</span>
          <span className="text-xs ml-2 text-gray-500">
            {status === "OPEN"
              ? endsIn
              : status === "CREATED"
              ? "Not open yet"
              : status === "CLOSED"
              ? "Ended"
              : null}
             
          </span>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-lg min-h-12  font-semibold leading-snug ">{question}</h3>

      {/* Pools */}
      <div className="mt-4 space-y-3">
        <PoolRow label="YES" value={yesPool} color="green" />
        <PoolRow label="NO" value={noPool} color="red" />
      </div>

      {/* CTA */}
      <button
        onClick={onClick}
        className="mt-5 w-full bg-black text-white py-2.5 rounded-xl font-semibold hover:opacity-90"
      >
        View Market
      </button>
    </div>
  );
}

function PoolRow({ label, value, color }) {
  const total = 1000;
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-gray-500">{value} PRED</span>
      </div>

      <div className="h-2 rounded-full bg-gray-100">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            color === "green" ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-1">{percentage}%</p>
    </div>
  );
}
