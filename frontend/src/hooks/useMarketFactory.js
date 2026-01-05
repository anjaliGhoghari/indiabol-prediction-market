import {ethers} from "ethers";
import FactoryABI from "../contracts/MarketFactoryABI.json";
import { MARKET_FACTORY_ADDRESS } from "../contracts/address";
import { getSigner } from "../utils/ethers";

export const getMarketFactory = async () =>{
    const signer = await getSigner();
    if(!signer) return null;

    return new ethers.Contract(
        MARKET_FACTORY_ADDRESS,
        FactoryABI,
        signer
    );
}