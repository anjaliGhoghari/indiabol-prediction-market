import { useEffect, useState } from "react";
import { getMarketFactory } from "../../hooks/useMarketFactory";
import { getPredictionMarket } from "../../hooks/usePredictionMarket";
import { formatStatus } from "../../utils/MarketHelpers";
import { useNavigate } from "react-router-dom";

export default function MyPredictions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        setLoading(true);

        // get user wallet
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // get all markets
        const factory = await getMarketFactory();
        const marketAddresses = await factory.getAllMarkets();

        const results = [];

        for (let addr of marketAddresses) {
          const market = await getPredictionMarket(addr);

          const [
            MarketAddress,
            question,
            state,
            yesStake,
            noStake,
            hasClaimed,
            winningOutcome,
          ] = await Promise.all([
            addr,
            market.question(),
            market.state(),
            market.userStakes(account, 1), // YES
            market.userStakes(account, 2), // NO
            market.hasClaimed(account),
            market.winningOutcome(),
          ]);

          // user has not participated
          if (yesStake == 0n && noStake == 0n) continue;
          if (yesStake > 0n) {
            results.push({
              MarketAddress: addr,
              market: question,
              choice: "YES",
              amount: Number(yesStake) / 1e18,
              status: formatStatus(Number(state)),
              canClaim: formatStatus(Number(state)) === "RESOLVED",
              hasClaimed,
              winningOutcome: Number(winningOutcome) === 1 ? "YES" : "NO",
            });
          }
          if (noStake > 0n) {
            results.push({
              MarketAddress: addr,
              market: question,
              choice: "NO",
              amount: Number(noStake) / 1e18,
              status: formatStatus(Number(state)),
              canClaim: formatStatus(Number(state)) === "RESOLVED",
              hasClaimed,
              winningOutcome: Number(winningOutcome) === 1 ? "YES" : "NO",
            });
          }
          console.log("resyt", results);
        }
        setRows(results);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading your predictions…</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="text-gray-500">
        You have not participated in any markets yet.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">My Predictions</h1>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {rows.map((p, i) => (
          <PredictionRow key={i} {...p} />
        ))}
      </div>
    </div>
  );
}

/* -------------------- Row -------------------- */

function PredictionRow({
  MarketAddress,
  market,
  choice,
  amount,
  status,
  canClaim,
  hasClaimed,
  winningOutcome,
}) {
  const getClaim = async (marketAddress) => {
    try {
      const market = await getPredictionMarket(marketAddress);

      const tx = await market.claimRewards();
      const receipt = await tx.wait();
      navigator(0);

      // Decode logs properly
      let rewardAmount = null;

      for (const log of receipt.logs) {
        try {
          const parsed = market.interface.parseLog(log);
          if (parsed.name === "RewardsClaimed") {
            rewardAmount = parsed.args.userAmount;
            break;
          }
        } catch (e) {
          // not this contract's log → ignore
        }
      }

      if (!rewardAmount) {
        alert("Reward claimed, but event not found");
        return;
      }

      alert(
        `Reward sent to your wallet: ${(Number(rewardAmount) / 1e18).toFixed(
          2
        )} PRED`
         
      );
    } catch (err) {
      console.error("Claim failed", err);
      alert("Failed to claim reward");
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-6 py-4 border-b last:border-b-0
   
    
    `}
    >
      <div className="space-y-1">
        <p className="font-medium">{market}</p>
        <p className="text-sm text-gray-500">
          Choice:{" "}
          <span
            className={choice === "YES" ? "text-green-600" : "text-red-600"}
          >
            {choice}
          </span>{" "}
          · {amount} PRED
        </p>
        {status === "RESOLVED" &&
          (winningOutcome === choice ? (
            <span className="text-sm text-green-500 font-medium">
              🎉 You won this market
            </span>
          ) : (
            <span className="text-sm text-red-400">
              ❌ You lost this market
            </span>
          ))}
      </div>

      <div className="flex items-center gap-4">
        <StatusBadge status={status} />

        {canClaim === true && winningOutcome === choice && (
          <button
            disabled={hasClaimed}
            onClick={() => getClaim(MarketAddress)}
            className={`px-4 py-2 rounded-lg bg-black  text-white text-sm font-medium hover:opacity-90 ${
              hasClaimed == true ? "bg-black/30" : ""
            } `}
          >
            {hasClaimed ? "Reward claimed" : "Claim"}
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------- Status -------------------- */

function StatusBadge({ status }) {
  const styles = {
    OPEN: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-100 text-gray-600",
    RESOLVED: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
