import { useState } from "react";
import { FAKE_TOKEN_ADDRESS } from "../contracts/address";
import { getMarketFactory } from "../hooks/useMarketFactory";

export default function CreateMarket() {
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState("");
  const [category,setCategory]=useState("5");

  const createMarket = async () => {
    const factory = await getMarketFactory();
    const tx = await factory.createMarket(
      FAKE_TOKEN_ADDRESS,
      question,
      Number(duration),
      category
    );
    await tx.wait();
    alert("Market created!");
  };

  return (
    <div>
      <h2>Create Market</h2>
      <input
        placeholder="Market Question"
        onChange={(e) => setQuestion(e.target.value)}
      />
      <input
        placeholder="Duration (seconds)"
        onChange={(e) => setDuration(e.target.value)}
      />
      <input
        placeholder="category"
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={createMarket}>Create</button>
    </div>
  );
}
