require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      // accounts: [
      //   "1c691adfe8f8c944563322f977b9920bc2a530287353e052f935f59fcead1831"
      // ],
    },
  },
};
