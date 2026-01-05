import { useState } from "react";
import { getFakeTokenContract } from "../hooks/useFakeToken";

export default function FaucetButton() {
  const [loading, setLoading] = useState(false);

  const claim = async () => {
    try {
      setLoading(true);
      const token = await getFakeTokenContract();
      const tx = await token.claimFaucet();
      await tx.wait();
      alert("Faucet claimed!");
    } catch (err) {
      alert(err.reason || "Cooldown active");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={claim} disabled={loading}>
      {loading ? "Claiming..." : "Claim Faucet"}
    </button>
  );
}
