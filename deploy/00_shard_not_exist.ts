module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("ThisShardDoesNotExist", {
    from: deployer,
    args: [
      "https://nftapi.com/metadata/",
    ],
    log: true,
  });
};
module.exports.tags = ["ThisShardDoesNotExist"];
