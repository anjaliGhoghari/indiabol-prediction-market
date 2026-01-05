import { useEffect, useState } from "react";
import { getMarketFactory } from "../hooks/useMarketFactory";

import WalletButton from "../components/WalletButton";
import FaucetButton from "../components/FaucetButton";

export default function MarketList() {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const loadMarkets = async () => {
      const factory = await getMarketFactory();
      const all = await factory.getAllMarkets();
      setMarkets(all);
    };
    loadMarkets();
    
  }, []);

  return (
    <div>
    <WalletButton/>
    <FaucetButton/>
      <h2>All Markets</h2>
      {markets.map((addr, i) => (
        <div key={i}>
          <a href={`/market/${addr}`}>{addr}</a>
        </div>
      ))}
    </div>
  );
}

