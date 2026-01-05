const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1️⃣ Deploy FakeToken
  const FakeToken = await hre.ethers.getContractFactory("FakeToken");
  const fakeToken = await FakeToken.deploy();
  await fakeToken.deployed(); // ✅ ethers v5

  console.log("FakeToken deployed at:", fakeToken.address);

  // 2️⃣ Deploy PredictionMarket
  // const PredictionMarket = await hre.ethers.getContractFactory(
  //   "PredictionMarket"
  // );

  // const question = "Will BTC cross $100k before 2026?";
  // const duration = 60 * 60; // 1 hour

  // const market = await PredictionMarket.deploy(
  //   fakeToken.address,
  //   question,
  //   duration
  // );

  // await market.deployed(); // ✅ ethers v5

  // console.log("PredictionMarket deployed at:", market.address);
  //deploy MarketFactory

  const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
  const factory = await MarketFactory.deploy();

  await factory.deployed(); // ✅ ethers v5
  console.log("MarketFactory deployed at:", factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
