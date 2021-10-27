// https://hardhat.org/guides/typescript.html#writing-tests-and-scripts-in-typescript
// https://codesandbox.io/s/vmth3?file=/hardhat.config.ts:1920-1929
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
// import "hardhat-typechain";
import { HardhatUserConfig } from "hardhat/config";

const projectId = "c66526088eb147109136c1dabbdf61cf";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
    //   accounts: []
    // },
    // mainnet: {
    //   url: `https://mainnet.infura.io/v3/${projectId}`,
    //   accounts: []
    // },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  typechain: {
    outDir: 'generated-types',
    target: 'ethers-v5',
    // alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    // externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
};
export default config;