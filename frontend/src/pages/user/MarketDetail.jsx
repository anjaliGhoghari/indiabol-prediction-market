import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPredictionMarket } from "../../hooks/usePredictionMarket";
import { formatStatus } from "../../utils/MarketHelpers";
import { ethers, formatUnits } from "ethers";
import {
  
  getToken,
  getSigner,
} from "../../hooks/usePredictionMarket";

export default function MarketDetail() {
  const { address } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const m = await getPredictionMarket(address);

        const [
          question,
          state,
          endTime,
          yesPool,
          noPool,
        ] = await Promise.all([
          m.question(),
          m.state(),
          m.endTime(),
          m.totalYesStakes(),
          m.totalNoStakes(),
        ]);

        setData({
          address,
          question,
          state: Number(state),
          status: formatStatus(Number(state)),
          endTime: Number(endTime),
          yesPool: Number(formatUnits(yesPool, 18)),
          noPool: Number(formatUnits(noPool, 18)),
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [address]);

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (!data) return null;

  return <MarketUI data={data} />;
}

/* ================= HELPER COMPONENTS ================= */

function Countdown({ endTime }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Update `now` every second
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, endTime * 1000 - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <p className="text-2xl font-bold tracking-wide">
      {h}h {m}m {s}s
    </p>
  );
}

function PoolRow({ label, value, pct, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-gray-500">
          {value} PRED · {pct}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-100">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            color === "green" ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Pools({ yesPool, noPool }) {
  const total = yesPool + noPool;
  const yesPct = total > 0 ? Math.round((yesPool / total) * 1) : 0;
  const noPct = total > 0 ? 1 - yesPct : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mt-6">
      <PoolRow label="YES" value={yesPool} pct={yesPct} color="green" />
      <div className="h-4" />
      <PoolRow label="NO" value={noPool} pct={noPct} color="red" />
    </div>
  );
}

function Actions({ status, address }) {
  const [txLoading, setTxLoading] = useState(false);

  const place = async (marketAddress,outcome) => {
    if (status !== "OPEN") {
      alert("Market is not open");
      return;
    }

    
const amount = prompt("Enter amount in PRED");
      if (!amount) return;

      const parsedAmount = ethers.parseUnits(amount, 18);

      const signer = await getSigner();
      const userAddress = await signer.getAddress();

      const token = await getToken();
      const market = await getPredictionMarket(marketAddress);

      // 1️⃣ Check allowance
      const allowance = await token.allowance(userAddress, market.target);

      // 2️⃣ Auto-approve if needed
      if (allowance < parsedAmount) {
        console.log("Auto approving token...");

        const approveTx = await token.approve(market.target, parsedAmount);
        await approveTx.wait();
      }
    try {
      setTxLoading(true);
      const m = await getPredictionMarket(address);
      const tx = await m.placePrediction(
        outcome,
        BigInt(amount) * 10n ** 18n
      );
      await tx.wait();
      alert("Prediction placed!");
    } finally {
      setTxLoading(false);
    }
  };

  const claim = async () => {
    try {
      setTxLoading(true);
      const m = await getPredictionMarket(address);
      const tx = await m.claimReward();
      await tx.wait();
      alert("Reward claimed!");
    } finally {
      setTxLoading(false);
    }
  };

  if (status === "OPEN") {
    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          disabled={txLoading}
          onClick={() => place(address ,1)}
          className="bg-green-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {txLoading ? "Processing..." : "Predict YES"}
        </button>

        <button
          disabled={txLoading}
          onClick={() => place(address,2)}
          className="bg-red-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {txLoading ? "Processing..." : "Predict NO"}
        </button>
      </div>
    );
  }

  if (status === "RESOLVED") {
    return (
      <button
        disabled={txLoading}
        onClick={claim}
        className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-50"
      >
        {txLoading ? "Processing..." : "Claim Reward"}
      </button>
    );
  }

  return <p className="text-gray-500 mt-6">Predictions closed.</p>;
}

function MarketUI({ data }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              data.status === "OPEN"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {data.status}
          </span>
          {data.status === "OPEN" ? (
            <Countdown endTime={data.endTime} />
          ) : data.status === "CREATED" ? (
            <span className="text-sm text-gray-500">Market not open yet</span>
          ) : data.status === "CLOSED" ? (
            <span className="text-sm text-gray-500">Market ended</span>
          ) : null}

          {/* {data.status === "OPEN"  ? (
            <Countdown endTime={data.endTime} />
          ) : (
            <span className="text-sm text-gray-500">Market ended</span>
          )}
          {data.status === "CREATED" ? <span className="text-sm text-gray-500">Market Not Open yet</span> : "" } */}

        </div>

        <h1 className="text-2xl font-semibold mt-4">
          {data.question}
        </h1>
      </div>

      <Pools yesPool={data.yesPool} noPool={data.noPool} />
      <Actions status={data.status} address={data.address} />
    </div>
  );
}
