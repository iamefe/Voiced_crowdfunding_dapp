/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    defaultNetwork: "mumbai",
    networks: {
      hardhat: {},
      mumbai: {
        // url: "https://mumbai.rpc.thirdweb.com",
        url: "https://polygon-mumbai.g.alchemy.com/v2/0HkkDYKOyZuxBb9yl_oXe52aqgDcX20N",
        accounts: [`0x${process.env.PRIVATE_KEY}`],
      },
      // sepolia: {
      //   url: "https://sepolia.rpc.thirdweb.com",
      //   // accounts: [`0x${process.env.PRIVATE_KEY}`],
      // },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
