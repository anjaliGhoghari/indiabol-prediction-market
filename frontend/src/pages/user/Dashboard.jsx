import { useEffect, useState } from "react";
import StatCard from "../../components/cards/StatCard";
import { getFakeTokenContract } from "../../hooks/useFakeToken";
import { getPredictionMarket } from "../../hooks/usePredictionMarket";
import { getMarketFactory } from "../../hooks/useMarketFactory";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [activePredictions, setActivePredictions] = useState(0);
  const [winReward, setWinReward] = useState("0");
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = await getFakeTokenContract();
      const account = await token.runner.getAddress();
      const bal = await token.balanceOf(account);
      const factory = await getMarketFactory();
      const addresses = await factory.getAllMarkets();
      // console.log("address",addresses);
      let count = 0;
      let totalrewardcount = 0;
      for (let i = 0; i < addresses.length; i++) {
        const market = await getPredictionMarket(addresses[i]);
        // console.log("market" + [i],market);
        const userYesStack = await market.userStakes(account, 1);
        // console.log("userYes" + [i],userYesStack);
        const userNoStack = await market.userStakes(account, 2);
        // console.log("userNo"+[i],userNoStack);
        const activeMarket = await market.state();
        // console.log("state"+[i],formatStatus(Number(activeMarket)));
        if (activeMarket === 1n && (userYesStack > 0n || userNoStack > 0n)) {
          count++;
        }
        const userTotalreward = await market.totalRewardClaimed(account);
        totalrewardcount += Number(userTotalreward);
        console.log("count", totalrewardcount);
      }
      

     setWinReward((Number(totalrewardcount) / 1e18).toString());

      setBalance((Number(bal) / 1e18).toString());
      setActivePredictions(count);
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Balance(PRED)" value={balance} />
        <StatCard title="Active Predictions" value={activePredictions} />
        <StatCard title="Win Reward (PRED)" value={winReward} />
        {/* <StatCard title="Win Rate" value={`${(winReward * 100).toFixed(1)}%`} /> */}
      </div>
    </div>
  );
}
