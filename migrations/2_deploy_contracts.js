const ThisShardDoesNotExist = artifacts.require("ThisShardDoesNotExist");

// If you want to hardcode what deploys, comment out process.env.X and use
// true/false;

module.exports = async (deployer, network, addresses) => {
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress = "";
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

  await deployer.deploy(ThisShardDoesNotExist, "https://ugly-big-oval-hippogriff.fission.app/json/", {gas: 5000000});
};
