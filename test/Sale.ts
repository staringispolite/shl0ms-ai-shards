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
        (await originalBalance).sub(await signer2.getBalance())
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
        "Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner."
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
        "Sale hasn't started -- Reason given: Sale hasn't started."
      );
    });

    it("should not allow owner to buy before sale", async () => {
      await expect(nftInstance.mint()).to.be.revertedWith(
        "Sale hasn't started -- Reason given: Sale hasn't started."
      );
    });

    it("should allow owner to start sale", async () => {
      expect(await nftInstance.hasSaleStarted()).to.be.false;
      await nftInstance.startSale();
      expect(await nftInstance.hasSaleStarted()).to.be.true;
    });

    it("should not allow users to start sale", async () => {
      const [_, signer2] = await ethers.getSigners();
      await expect(nftInstance.connect(signer2).startSale()).to.be.revertedWith('Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.')
    });

    /*
    it("should allow users to buy after sale starts", async () => {
      const instance = await contractClass.new("https://nftapi.com/metadata/");

      // Set up sale
      const startSaleResult = await instance.startSale({ from: owner });
      expect(startSaleResult.receipt.status).to.equal(true);

      // Buy
      const buyResult = await instance.mint({
        from: bob,
        value: web3.utils.toWei("0.069", "ether"),
      });
      expect(buyResult.receipt.status).to.equal(true);

      // Confirm buy
      const numPoops = await instance.totalSupply({ from: bob });
      expect(numPoops.toNumber()).to.equal(1);
    });

    it("should correctly create tokenURIs", async () => {
      const instance = await contractClass.new("https://nftapi.com/metadata/");

      // Set up sale
      const startSaleResult = await instance.startSale({ from: owner });
      expect(startSaleResult.receipt.status).to.equal(true);

      // Buy
      const buyResult = await instance.mint({
        from: bob,
        value: web3.utils.toWei("0.069", "ether"),
      });
      expect(buyResult.receipt.status).to.equal(true);

      const tokenURI = await instance.tokenURI(176);
      console.log("Spot check token URI:");
      console.log(tokenURI);
    });

    it("should require the correct price", async () => {
      const instance = await contractClass.new("https://nftapi.com/metadata/");

      // Set up the sale
      const startSaleResult = await instance.startSale({ from: owner });
      expect(startSaleResult.receipt.status).to.equal(true);

      // Buy with no ETH
      await expectRevert(
        instance.mint({ from: alice }),
        "Ether value required is 0.069"
      );
    });
    */
  });
});
