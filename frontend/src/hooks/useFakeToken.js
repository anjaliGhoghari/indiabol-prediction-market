import { ethers } from "ethers";
import FakeTokenABI from "../contracts/FakeTokenABI.json";
import { FAKE_TOKEN_ADDRESS } from "../contracts/address";
import { getSigner } from "../utils/ethers";

export const getFakeTokenContract = async () => {
  const signer = await getSigner();
  if (!signer) return null;

  return new ethers.Contract(
    FAKE_TOKEN_ADDRESS,
    FakeTokenABI,
    signer
  );
};
