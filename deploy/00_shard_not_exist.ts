module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("ThisShardDoesNotExist", {
    from: deployer,
    args: [
      "https://ugly-big-oval-hippogriff.fission.app/json/",
    ],
    log: true,
  });
};
module.exports.tags = ["ThisShardDoesNotExist"];
