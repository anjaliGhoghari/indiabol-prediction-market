import { useEffect, useState } from "react";
import FilterButton from "../../components/ui/FilterButton";
import MarketGrid from "../../components/MarketGrid";
import { getMarketFactory } from "../../hooks/useMarketFactory";
import { getPredictionMarket } from "../../hooks/usePredictionMarket";
import { formatStatus, formatEndsIn } from "../../utils/MarketHelpers";
import { CATEGORIES } from "../../utils/categories";
// import { marketCategoryMap } from "../../utils/marketCategoryMap";

export default function Markets() {
  const [filter, setFilter] = useState("ALL");
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setLoading(true);
        const factory = await getMarketFactory();
        const addresses = await factory.getAllMarkets();
        const data = await Promise.all(
          addresses.map(async (address) => {
            const m = await getPredictionMarket(address);

            const [question, state, endTime, yesPool, noPool, category] =
              await Promise.all([
                m.question(),
                m.state(),
                m.endTime(),
                m.totalYesStakes(),
                m.totalNoStakes(),
                m.category(),
              ]);
            const categoryIndex = await m.category();
            const categoryName = CATEGORIES[Number(categoryIndex)];
            return {
              address,
              question,
              status: formatStatus(Number(state)),
              endsIn: formatEndsIn(Number(endTime)),
              yesPool: Number(yesPool) / 1e18,
              noPool: Number(noPool) / 1e18,
              category: categoryName,
            };
          })
        );

        setMarkets(data);
      } catch (e) {
        console.error("Failed to load markets", e);
      } finally {
        setLoading(false);
      }
    };

    loadMarkets();
  }, []);

  const filtered = markets.filter((m) => {
    const categoryMatch = category === "" || m.category === category;

    const statusMatch = filter === "ALL" || m.status === filter;

    return categoryMatch && statusMatch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* <h1 className="text-3xl font-semibold">Markets</h1> */}
        <div className="flex gap-3 overflow-scroll pb-2">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
    ${
      category === ""
        ? "bg-black text-white"
        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
    }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
        ${
          category === cat
            ? "bg-black text-white"
            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading markets…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No markets found.</p>
      ) : (
        <MarketGrid markets={filtered} />
      )}
    </div>
  );
}
