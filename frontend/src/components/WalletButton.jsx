import { useState } from "react";

export default function WalletButton() {
  const [account, setAccount] = useState("");
  if (!window.ethereum) {
    alert("MetaMask not found");
    return null;
  }
  const connectWallet = async () => {

    const [acc] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(acc);
  };

  return (
    <button onClick={connectWallet}>
      {account ? `${account.slice(0, 6)}...` : "Connect Wallet"}
    </button>
  );
}
