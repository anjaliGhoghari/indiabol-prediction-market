import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
// import { getFakeToken } from "../hooks/useFakeToken";
import {
  getPredictionMarket,
  getToken,
  getSigner,
} from "../hooks/usePredictionMarket";

const STATE_LABEL = {
  0: "CREATED",
  1: "OPEN",
  2: "CLOSED",
  3: "RESOLVED",
};

export default function MarketDetail() {
  const { address } = useParams();
  const [yes, setYes] = useState(0);
  const [no, setNo] = useState(0);

  const [question, setQuestion] = useState("");
  const [state, setState] = useState(0); // ✅ number
  const [endTime, setEndTime] = useState(0);

  useEffect(() => {
    if (!address) return;

    const loadMarket = async () => {
      const market = await getPredictionMarket(address);

      setQuestion(await market.question());
      setState(Number(await market.state())); // ✅ keep number
      setEndTime(Number(await market.endTime()));
    };

    loadMarket();
  }, [address]);
  useEffect(() => {
  if (!address) return;

  const loadStakes = async () => {
    const market = await getPredictionMarket(address);

    const yesStake = await market.totalYesStakes();
    const noStake = await market.totalNoStakes();

    setYes(ethers.formatUnits(yesStake, 18));
    setNo(ethers.formatUnits(noStake, 18));
  };

  loadStakes();
}, [address]);

  // ---------- USER ACTIONS ----------
  const placePrediction = async (marketAddress, outcome) => {
    try {
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

      // 3️⃣ Place prediction
      const tx = await market.placePrediction(outcome, parsedAmount);
      await tx.wait();
      const yesStake = await market.totalYesStakes();
      const noStake = await market.totalNoStakes();

      setYes(ethers.formatUnits(yesStake, 18));
      setNo(ethers.formatUnits(noStake, 18));

      alert("Prediction placed successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Transaction failed ❌");
    }
  };

  const claimReward = async () => {
    const market = await getPredictionMarket(address);
    const tx = await market.claimReward(); // ✅ correct name
    await tx.wait();
    alert("Reward claimed!");
  };

  // ---------- ADMIN ACTIONS ----------
  const openMarket = async () => {
    const market = await getPredictionMarket(address);
    const tx = await market.openMarket();
    await tx.wait();
    alert("Market opened");
  };

  const closeMarket = async () => {
    const market = await getPredictionMarket(address);
    const tx = await market.closeMarket();
    await tx.wait();
    alert("Market closed");
  };

  const resolveMarket = async (outcome) => {
    const market = await getPredictionMarket(address);
    const tx = await market.resolveMarket(outcome);
    await tx.wait();
    alert("Market resolved");
  };

  return (
    <div>
      <h2>{question}</h2>
      <p>YES: {yes}</p>
      <p>NO: {no}</p>
      <p>State: {STATE_LABEL[state]}</p>
      <p>Ends at: {new Date(endTime * 1000).toLocaleString()}</p>

      {/* ADMIN CONTROLS */}
      {state === 0 && <button onClick={openMarket}>Open Market</button>}

      {state === 1 && (
        <>
          <button onClick={() => placePrediction(address, 1)}>YES</button>
          <button onClick={() => placePrediction(address, 2)}>NO</button>
        </>
      )}

      {state === 2 && (
        <>
          <button onClick={() => resolveMarket(1)}>Resolve YES</button>
          <button onClick={() => resolveMarket(2)}>Resolve NO</button>
        </>
      )}

      {state === 3 && <button onClick={claimReward}>Claim Reward</button>}

      <button onClick={closeMarket} >Close MAraket</button>
    </div>
  );
}
