import { ethers } from "ethers";

export const getProvider = () => {
  if (!window.ethereum) {
    alert("MetaMask not found");
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  return await provider.getSigner();
};
