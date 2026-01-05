import { useEffect, useState } from "react";
import { getFakeTokenContract } from "../hooks/useFakeToken";

export default function Balance() {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const loadBalance = async () => {
      const token = await getFakeTokenContract();
      if (!token) return;

      const signer = await token.runner.getAddress();
      const bal = await token.balanceOf(signer);
      setBalance((Number(bal) / 1e18).toString());
    };

    loadBalance();
  }, []);

  return <p>Balance: {balance} PRED</p>;
}
