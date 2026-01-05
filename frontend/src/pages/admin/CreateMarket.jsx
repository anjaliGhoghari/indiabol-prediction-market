import { useState } from "react";
import { CATEGORY_OPTIONS } from "../../utils/categories";
import { getMarketFactory } from "../../hooks/useMarketFactory";
import { FAKE_TOKEN_ADDRESS } from "../../contracts/address";
// import { getPredictionMarket } from "../../hooks/usePredictionMarket";
function CreateMarket() {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState("");
  const createMarket = async () => {
    if (!question && !duration) {
      alert("please fill the field");
      return;
    }
    
    try{
      setLoading(true);
      const factory = await getMarketFactory();
      // console.log("factory",factory);
      const tx = await factory.createMarket(
        FAKE_TOKEN_ADDRESS,
        question,
        Number(duration),
        category
      );
      await tx.wait();
      //  console.log("data",tx);
      alert("Market created & opened successfully 🚀");
      setQuestion("");
      setDuration("");
      setCategory(0);
    }catch(err){
      console.log("Failed to create Market!!!",err);
    }finally{
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold mb-6 text-emerald-400">
        Create Market
      </h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-base text-slate-400 mb-1">
            Question:
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
            placeholder="Will India win the next World Cup?"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base text-slate-400 mb-1">
            Duration (seconds)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200"
            placeholder="86400 (1 day)"
          />
        </div>
        <button
          onClick={createMarket}
          disabled={loading}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Creating..." : "Create Market"}
        </button>
      </div>
    </div>
  );
}

export default CreateMarket;
