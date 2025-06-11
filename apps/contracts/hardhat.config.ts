import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337, // Default chain ID for Hardhat network
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Local node URL
      chainId: 31337, // Default chain ID for Hardhat network
    },
  },
};

export default config;
