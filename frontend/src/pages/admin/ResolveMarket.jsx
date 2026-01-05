import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPredictionMarket } from "../../hooks/usePredictionMarket";
import { formatStatus } from "../../utils/MarketHelpers";
import { getMarketFactory } from "../../hooks/useMarketFactory";

export default function ResolveMarket() {
  const [loading, setLoading] = useState(true);
  const [market, setmarket] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const address = params.get("market");
  useEffect(() => {
    if (!address) return;
    const load = async () => {
      try {
        const data = await getPredictionMarket(address);
        const [question, state, yespool, nopool] = await Promise.all([
          data.question(),
          data.state(),
          data.totalYesStakes(),
          data.totalNoStakes(),
        ]);
        setmarket({
          address,
          question,
          status: formatStatus(Number(state)),
          yespool: Number(yespool) / 1e18,
          nopool: Number(nopool) / 1e18,
        });
      } catch (e) {
        console.error(e);
        alert("Failed to load market");
      } finally {
        setLoading(false);
      }
    };
    // console.log("market", market.yesPool);
    load();
  }, [address]);

  const resolve = async () => {
    if (outcome === null) {
      alert("Please select YES or NO");
      return;
    }
    try {
  setResolving(true);

  const factory = await getMarketFactory();

  const tx = await factory.resolveMarket(address, outcome);
  await tx.wait();

  alert("Market resolved successfully!");
  navigate("/admin/markets");

} catch (e) {
  console.error(e);
  alert("Failed to resolve market");
} finally {
  setResolving(false);
}
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold mb-6 text-emerald-400">
        Resolve Market
      </h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div>
          <p className="text-sm text-slate-400 mb-1">Market Question</p>
          <p className="text-lg font-medium">{market.question}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <PoolCard label="YES Pool" value={market.yespool} />
          <PoolCard label="NO Pool" value={market.nopool} />
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-2">Select winning outcome</p>

          <div className="flex gap-4">
            <OutcomeButton
              active={outcome === 1}
              onClick={() => setOutcome(1)}
              label="YES"
              color="green"
            />
            <OutcomeButton
              active={outcome === 2}
              onClick={() => setOutcome(2)}
              label="NO"
              color="red"
            />
          </div>
          <div className="text-xs mt-4 text-yellow-400 bg-yellow-900/30 border border-yellow-800 rounded-lg p-3">
            ⚠️ This action is irreversible. Once resolved, users can claim
            rewards.
          </div>
          <button
            onClick={resolve}
            disabled={resolving}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold"
          >
            {resolving ? "Resolving…" : "Resolve Market"}
          </button>
        </div>
      </div>
    </div>
  );
}
function PoolCard({ label, value }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-xl font-semibold mt-1 text-green-500`}>
        {value} PRED
      </p>
    </div>
  );
}
function OutcomeButton({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl font-semibold border transition
        ${
          active
            ? `bg-${color}-500 text-black/65 border-none`
            : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
        }`}
    >
      {label}
    </button>
  );
}
