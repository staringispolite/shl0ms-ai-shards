import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";
import { ethers, deployments } from "hardhat";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ThisShardDoesNotExist } from "../typechain";

describe("Sale", () => {
  let signer: SignerWithAddress;
  let signerAddress: string;
  let nftInstance: ThisShardDoesNotExist;

  beforeEach(async () => {
    const { ThisShardDoesNotExist } = await deployments.fixture(["ThisShardDoesNotExist"]);
    nftInstance = (await ethers.getContractAt(
      "ThisShardDoesNotExist",
      ThisShardDoesNotExist.address
    )) as ThisShardDoesNotExist;

    signer = (await ethers.getSigners())[0];
    signerAddress = await signer.getAddress();
  });

  describe("with a serial", () => {
    it("handles test", async () => {
      expect(await nftInstance.hasSaleStarted()).to.be.true;
    });
  }) ;
});
