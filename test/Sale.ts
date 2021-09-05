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
    const { ThisShardDoesNotExist } = await deployments.fixture([
      "ThisShardDoesNotExist",
    ]);
    nftInstance = (await ethers.getContractAt(
      "ThisShardDoesNotExist",
      ThisShardDoesNotExist.address
    )) as ThisShardDoesNotExist;

    signer = (await ethers.getSigners())[0];
    signerAddress = await signer.getAddress();
  });

  describe("with a serial", () => {
    it("should print all the shardId=>fntnId mappings", async () => {
      console.log("ShardId to FNTN Token Id mappings:");
      for (let i = 1; i <= 175; i++) {
        console.log(i + " => " + (await nftInstance.shardIdToTokenId(i)));
      }
    });

    it("should allow owner to transfer ownership", async () => {
      const [_, signer2] = await ethers.getSigners();
      expect(
        await nftInstance.transferOwnership(await signer2.getAddress())
      ).to.emit(nftInstance, "OwnershipTransferred");
      const newOwner = await nftInstance.owner();
      expect(newOwner).to.equal(await signer2.getAddress());
    });
    it("should allow new owner to withdraw", async () => {
      const [_, signer2] = await ethers.getSigners();
      expect(
        await nftInstance.transferOwnership(await signer2.getAddress())
      ).to.emit(nftInstance, "OwnershipTransferred");
      const newOwner = await nftInstance.owner();
      expect(newOwner).to.equal(await signer2.getAddress());

      const originalBalance = await signer2.getBalance();
      await nftInstance.connect(signer2).withdrawAll();
      expect(
        (await originalBalance).sub(await signer2.getBalance()).toNumber()
      ).to.be.greaterThan(0);
    });

    it("should not allow old owner to withdraw", async () => {
      const [_, signer2] = await ethers.getSigners();
      expect(
        await nftInstance.transferOwnership(await signer2.getAddress())
      ).to.emit(nftInstance, "OwnershipTransferred");
      const newOwner = await nftInstance.owner();
      expect(newOwner).to.equal(await signer2.getAddress());

      expect(nftInstance.withdrawAll()).to.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should report that it supports the ERC721 interfaces", async () => {
      const _INTERFACE_ID_ERC721 = "0x80ac58cd";
      const _INTERFACE_ID_ERC721_METADATA = "0x5b5e139f";
      const _INTERFACE_ID_ERC721_ENUMERABLE = "0x780e9d63";

      let supportResponse = await nftInstance.supportsInterface(
        _INTERFACE_ID_ERC721
      );
      expect(supportResponse).to.equal(true);
      supportResponse = await nftInstance.supportsInterface(
        _INTERFACE_ID_ERC721_METADATA
      );
      expect(supportResponse).to.equal(true);
      supportResponse = await nftInstance.supportsInterface(
        _INTERFACE_ID_ERC721_ENUMERABLE
      );
      expect(supportResponse).to.equal(true);
    });

    it("should not allow users to buy before sale", async () => {
      const [_, signer2] = await ethers.getSigners();
      await expect(nftInstance.connect(signer2).mint()).to.be.revertedWith(
        "Sale hasn't started"
      );
    });

    it("should not allow owner to buy before sale", async () => {
      await expect(nftInstance.mint()).to.be.revertedWith(
        "Sale hasn't started"
      );
    });

    it("should allow owner to start sale", async () => {
      expect(await nftInstance.hasSaleStarted()).to.be.false;
      await nftInstance.startSale();
      expect(await nftInstance.hasSaleStarted()).to.be.true;
    });

    it("should not allow users to start sale", async () => {
      const [_, signer2] = await ethers.getSigners();
      await expect(nftInstance.connect(signer2).startSale()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should allow users to buy after sale starts", async () => {
      const [_, signer2] = await ethers.getSigners();

      // Set up sale
      await nftInstance.startSale();

      // Buy
      expect(
        await nftInstance.connect(signer2).mint({
          value: ethers.utils.parseEther("0.069"),
        })
      ).to.emit(nftInstance, "Transfer");

      // Confirm buy
      expect(await nftInstance.totalSupply()).to.be.equal(1);
    });

    it("should correctly create tokenURIs", async () => {
      const [_, __, signer3] = await ethers.getSigners();

      // Set up sale
      await nftInstance.startSale();

      // Buy
      await nftInstance.connect(signer3).mint({
        value: ethers.utils.parseEther("0.069"),
      });

      const tokenURI = await nftInstance.tokenURI(176);
      console.log("Spot check token URI:");
      console.log(tokenURI);
    });

    it("should require the correct price", async () => {
      const [_, signer2] = await ethers.getSigners();
      // Set up the sale
      await nftInstance.startSale();

      // Buy with no ETH
      await expect(nftInstance.connect(signer2).mint()).to.be.revertedWith(
        "Ether value required is 0.069"
      );
    });
  });
});
