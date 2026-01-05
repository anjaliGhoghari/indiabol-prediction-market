import { useEffect, useState } from "react";
import { getMarketFactory } from "../../hooks/useMarketFactory";
import { getPredictionMarket } from "../../hooks/usePredictionMarket";

export default function AdminDashboard() {
  const [account, setAccount] = useState();
  const [totalMarket, setTotalMarket] = useState("0");
  const [openMarket, setOpenMarket] = useState("3");
  const [totalVolume, setTotalVolume] = useState("1000");
  const [totalRoyalty, setTotalRoyalty] = useState("");
   const loadMarket = async () => {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(account);
      // console.log("ac",account);
      const factory = await getMarketFactory();
      const totalMarkets = await factory.getAllMarkets();
      // console.log("totalmarkets",totalMarkets);
      setTotalMarket(totalMarkets.length);

      let totalRoyalty = 0;
      let totalBalance = 0;
      let count = 0;
      for (let i = 0; i < totalMarkets.length; i++) {
        const market = await getPredictionMarket(totalMarkets[i]);
        // console.log("marke",market);
        const state = await market.state();
        // console.log("state" + i,Number(openMarket));
        const yes = await market.totalYesStakes();
        // console.log("ys",Number(yes));
        const no = await market.totalNoStakes();
        // console.log("nn",Number(no));
        totalBalance += Number(yes) + Number(no);
        const Royalty = await market.totalPlatformFees();
        totalRoyalty += Number(Royalty);
        if(state==1 ? count++ : null);
        // console.log("count",count);
        // console.log("ttotal", totalRoyalty);
      }
      setTotalRoyalty((totalRoyalty / 1e18).toString());
      setOpenMarket(count);
      setTotalVolume((totalBalance / 1e18).toString());
    };
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMarket();
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 text-emerald-400">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <AdminStat title="Total Markets" value={totalMarket} />
        <AdminStat title="Open Markets" value={openMarket} />
        <AdminStat title="Total Volume(PRED)" value={totalVolume} />
        <AdminStat title="Total Royalty(PRED)" value={totalRoyalty} />
      </div>
    </div>
  );
}

function AdminStat({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl text-green-400 font-semibold mt-2">{value}</p>
    </div>
  );
}
