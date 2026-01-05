import WalletButton from "../WalletButton";
import { useEffect, useState } from "react";
import { getFakeTokenContract } from "../../hooks/useFakeToken";

export default function Topbar() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const fetchBalance = async () => {
    try {
      const token = await getFakeTokenContract();
      if (!token) return;
      const signer = await token.runner.getAddress();
      const bal = await token.balanceOf(signer);
      setBalance((Number(bal) / 1e18).toString());
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };
  useEffect(() => {
    const connectWallet = async () => {
      const [acc] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(acc);
      console.log("Connected account:", acc);

      fetchBalance();
    };
    connectWallet();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <p className="text-sm text-gray-500">Welcome back 👋</p>

      <div className="flex items-center gap-4">
      {account ? <span className="text-sm font-medium">Balance: {balance} PRED</span> : <WalletButton/>}
       

        {/* <WalletButton /> */}
      </div>
    </header>
  );
}
