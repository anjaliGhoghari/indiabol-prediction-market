import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMarketFactory } from "../../hooks/useMarketFactory";
import { getPredictionMarket } from "../../hooks/usePredictionMarket";
import { formatStatus } from "../../utils/MarketHelpers";
import { CATEGORY_OPTIONS } from "../../utils/categories";

function AdminMarkets() {
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState([]);
  const navigate = useNavigate();
   const load = async () => {
    try {
      const factroy = await getMarketFactory();
      const addresses = await factroy.getAllMarkets();
      const data = await Promise.all(
        addresses.map(async (address) => {
          const m = await getPredictionMarket(address);
          const [question, state, endTime, category] = await Promise.all([
            m.question(),
            m.state(),
            m.endTime(),
            m.category(),
          ]);
          return {
            address,
            question,
            status: formatStatus(Number(state)),
            endTime: Number(endTime),
            category: CATEGORY_OPTIONS[Number(category)],
          };
        })
      );
      setMarkets(data);
    //   console.log("mar", data);
    } catch (err) {
      console.log("can't fetch data", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    const interval = setInterval(() => {
      load();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

 
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 text-emerald-400">Markets</h1>
      {loading ? (
        <h1>Market Loading...</h1>
      ) : (
        <MarketTable
          markets={markets}
          onResolve={(addr) => navigate(`/admin/resolve?market=${addr}`)}
        />
      )}
    </div>
  );
}

export default AdminMarkets;

function MarketTable({ markets, onResolve }) {
  const now = Math.floor(Date.now() / 1000);
  const closeMarket = async (marketaddress) => {
    const market = await getPredictionMarket(marketaddress);
    const tx = await market.closeMarket();
    await tx.wait();
    alert("Market Closed");
    // await load();
  };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-400">
          <tr>
            <th className="text-left px-6 py-3">Question</th>
            <th className="text-left px-6 py-3">Category</th>
            <th className="text-left px-6 py-3">Status</th>
            <th className="text-left px-6 py-3">End Time</th>
            <th className="text-right px-6 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {markets.map((m) => (
            <tr
              key={m.address}
              className={`border-t border-slate-800 hover:bg-slate-800/40
              ${now > m.endTime && m.status != "CLOSED" ? "bg-red-900/15" : ""}
              ${m.status === "RESOLVED" ? "bg-gray-700 hover:bg-slate-700 cursor-not-allowed" : ""}
              `}
            >
              <td className="px-6 py-4 max-w-md truncate">{m.question}</td>

              <td className="px-6 py-4">
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-900 text-indigo-300">
                  {m.category.label}
                </span>
              </td>

              <td className="px-6 py-4">
                <StatusBadge status={m.status} />
              </td>

              <td className="px-6 py-4 text-slate-400">
                {new Date(m.endTime * 1000).toLocaleString()}
                {now > m.endTime ? "" : " Close soon"}
              </td>

              <td className="px-6 py-4 text-right">
                {m.status === "OPEN" && (
                  <button
                    onClick={() => closeMarket(m.address)}
                    disabled={now <= m.endTime}
                    className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium
                ${
                  now > m.endTime
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-red-200 cursor-not-allowed"
                }
                `}
                  >
                    Close
                  </button>
                )}
                {m.status === "CLOSED" && (
                  <button
                    onClick={() => onResolve(m.address)}
                    className="px-3 py-1.5 rounded-lg bg-yellow-600 text-white text-xs font-medium hover:bg-yellow-700"
                  >
                    Resolve
                  </button>
                )}
                {m.status === "RESOLVED" && (
                  <button
                    className="px-3 py-1.5 rounded-lg bg-gray-600 text-white text-xs font-medium"
                  >
                    Shut Down
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    OPEN: "bg-green-900 text-green-300",
    CLOSED: "bg-yellow-900 text-yellow-300",
    RESOLVED: "bg-blue-900 text-blue-300",
    CREATED: "bg-slate-500 text-blue-300",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}
