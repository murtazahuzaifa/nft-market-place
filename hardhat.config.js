require("@nomiclabs/hardhat-waffle");

const projectId = "c66526088eb147109136c1dabbdf61cf";

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: []
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: []
    },
  },
  solidity: "0.8.4",
};
