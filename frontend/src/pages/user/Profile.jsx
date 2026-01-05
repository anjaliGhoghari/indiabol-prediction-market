import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { getFakeTokenContract } from "../../hooks/useFakeToken";
import { getSigner } from "../../utils/ethers";

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function Profile() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [lastClaimed, setLastClaimed] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      // if (!window.ethereum) return;

      setLoading(true);
      try {
        const signer = await getSigner();
        if (!signer) return;

        const acc = await signer.getAddress();
        setAccount(acc);

        const token = await getFakeTokenContract();
        if (!token) return;

        const bal = await token.balanceOf(acc);
        setBalance(formatUnits(bal, 18));

        const last = await token.lastFaucetClaim(acc);
        setLastClaimed(Number(last) * 1000); // seconds → ms
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const isCooldownActive =
    typeof lastClaimed === "number" && now < lastClaimed + COOLDOWN_MS;

  const remainingMs = lastClaimed
    ? Math.max(0, lastClaimed + COOLDOWN_MS - now)
    : 0;

  const h = Math.floor(remainingMs / 3600000);
  const m = Math.floor((remainingMs % 3600000) / 60000);
  const s = Math.floor((remainingMs % 60000) / 1000);

  const claim = async () => {
    try {
      setLoading(true);
      const signer = await getSigner();
      if (!signer) throw new Error("Wallet not connected");

      const token = await getFakeTokenContract();
      if (!token) throw new Error("Token contract not available");

      const tx = await token.claimFaucet();
      await tx.wait();

      const acc = await signer.getAddress();
      const last = await token.lastFaucetClaim(acc);
      setLastClaimed(Number(last) * 1000);

      const bal = await token.balanceOf(acc);
      setBalance(formatUnits(bal, 18));

      alert("Faucet claimed!");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to claim faucet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Profile</h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <ProfileRow label="Wallet Address" value={truncateAddress(account)} />
        <ProfileRow label="Balance" value={`${Number(balance).toFixed(4)} PRED`} />
      </div>

      <button
        onClick={claim}
        disabled={loading || isCooldownActive || !account}
        className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            loading || isCooldownActive || !account
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
      >
        {loading
          ? "Claiming..."
          : isCooldownActive
          ? `Claim Faucet`
          : "Claim Faucet"}
      </button>

      {isCooldownActive && (
        <p className="text-xs text-gray-500 mt-2">
          You can claim again in {h}h {m}m {s}s
        </p>
      )}
    </div>
  );
}

function truncateAddress(addr = "") {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium truncate max-w-[60%]">{value}</span>
    </div>
  );
}
