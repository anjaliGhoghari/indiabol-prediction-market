import MarketCard from "../components/cards/MarketCard";
import { useNavigate } from "react-router-dom";

export default function MarketGrid({ markets }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((m) => (
        <MarketCard
          key={m.address}
          question={m.question}
          status={m.status}
          endsIn={m.endsIn}
          yesPool={m.yesPool}
          noPool={m.noPool}
          category={m.category}
          onClick={() =>
            navigate(`/app/market/${m.address}`)
          }
        />
      ))}
    </div>
  );
}
