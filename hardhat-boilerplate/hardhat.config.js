require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "galadriel",
  networks: {
    hardhat: {},
    galadriel: {
      url: `https://devnet.galadriel.com`,
      accounts: ["f0e1b1c8270d61429bd547c0c2e7d0fa80f2b9abd944b5efe409f0ae69584385"],
    },
  },
  etherscan: {
    customChains: [
      {
        network: "galadriel",
        chainId: 696969,
        urls: {
          //Blockscout
          apiURL: " https://explorer.galadriel.com",
          browserURL: " https://explorer.galadriel.com",
        },
      },
    ],
  }
};
