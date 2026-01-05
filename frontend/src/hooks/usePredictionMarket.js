// import {ethers} from "ethers";
// import PredictionMarketABI from "../contracts/PredictionMarketABI.json";
// import { getSigner } from "../utils/ethers";
// import { TOKEN_ADDRESS } from "../contracts/address";

// export const getPredictionMarket = async (marketAddress)=>{
//     const signer = await getSigner();
//     if(!signer) return null;
//     return new ethers.Contract(
//         marketAddress,
//         PredictionMarketABI,
//         signer
//     )
    
// }
// src/hooks/usePredictionMarket.js
import { ethers } from "ethers";
import FakeTokenABI from "../contracts/FakeTokenABI.json";
import PredictionMarketABI from "../contracts/PredictionMarketABI.json";
import { FAKE_TOKEN_ADDRESS} from "../contracts/address"

/**
 * Always returns the ACTIVE MetaMask signer
 */
export const getSigner = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
};

/**
 * FakeToken contract (with signer)
 */
export const getToken = async () => {
  const signer = await getSigner();

  return new ethers.Contract(
    FAKE_TOKEN_ADDRESS,
    FakeTokenABI,
    signer
  );
};

export const getPredictionMarket = async (marketAddress) => {
  const signer = await getSigner();
  return new ethers.Contract(
    marketAddress,
    PredictionMarketABI,
    signer
  );
};
// export const getPredictionMarket = async (marketAddress)=>{
//     const signer = await getSigner();
//     if(!signer) return null;
//     return new ethers.Contract(
//         marketAddress,
//         PredictionMarketABI,
//         signer
//     )
    
// }
