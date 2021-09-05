var chai = require('chai');
var expect = chai.expect;
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const contractClass = artifacts.require('ThisShardDoesNotExist');
const utils = require('./helpers/util');

contract("ThisShardDoesNotExist", async (accounts) => {
  let [owner, alice, bob] = accounts;

  it("should print all the shardId=>fntnId mappings", async () => {
   const instance = await contractClass.new("https://nftapi.com/metadata/");

    console.log('ShardId to FNTN Token Id mappings:');
    for (let i = 1; i <= 175; i++) {
      console.log(i + " => " + await instance.shardIdToTokenId(i));
    }
  });

  // Only for use when grabbing selectors or interface IDs before deploy
  xit("should print its selector hashes", async () => {
   const instance = await contractClass.new("https://nftapi.com/metadata/");

    console.log('see the main contract ::calculateSelector for which this is:');
    console.log(await instance.calculateSelector());
  });

  it("should allow owner to transfer ownership", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    const txn = await instance.transferOwnership(alice, {from: owner});
    expect(txn.receipt.status).to.equal(true);
    expectEvent(txn, "OwnershipTransferred", {
      previousOwner: owner, newOwner: alice });

    const newOwner = await instance.owner();
    expect(newOwner).to.equal(alice);
  });

  it("should allow new owner to withdraw", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    const txn = await instance.transferOwnership(alice, {from: owner});
    expect(txn.receipt.status).to.equal(true);
    expectEvent(txn, "OwnershipTransferred", {
      previousOwner: owner, newOwner: alice });

    const newOwner = await instance.owner();
    expect(newOwner).to.equal(alice);

    const withdrawResult = await instance.withdrawAll({from: alice});
    expect(withdrawResult.receipt.status).to.equal(true);
  });

  it("should not allow old owner to withdraw", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    const txn = await instance.transferOwnership(alice, {from: owner});
    expect(txn.receipt.status).to.equal(true);
    expectEvent(txn, "OwnershipTransferred", {
      previousOwner: owner, newOwner: alice });

    const newOwner = await instance.owner();
    expect(newOwner).to.equal(alice);

    await expectRevert(instance.withdrawAll({from: owner}),
      "Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.");
  });

  it("should report that it supports the ERC721 interfaces", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    const _INTERFACE_ID_ERC721 = "0x80ac58cd";
    const _INTERFACE_ID_ERC721_METADATA = "0x5b5e139f";
    const _INTERFACE_ID_ERC721_ENUMERABLE = "0x780e9d63";

    let supportResponse = await instance.supportsInterface(_INTERFACE_ID_ERC721);
    expect(supportResponse).to.equal(true);
    supportResponse = await instance.supportsInterface(_INTERFACE_ID_ERC721_METADATA);
    expect(supportResponse).to.equal(true);
    supportResponse = await instance.supportsInterface(_INTERFACE_ID_ERC721_ENUMERABLE);
    expect(supportResponse).to.equal(true);
  });

  it("should not allow users to buy before sale", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");
    await expectRevert(instance.mint({from: bob}), 
      "Sale hasn't started -- Reason given: Sale hasn't started.");
  });

  it("should not allow owner to buy before sale", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");
    await expectRevert(instance.mint({from: owner}),
      "Sale hasn't started -- Reason given: Sale hasn't started.");
  });

  it("should allow owner to start sale", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    const result = await instance.startSale({from: owner});
    expect(result.receipt.status).to.equal(true);
  });

  it("should not allow users to start sale", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    await expectRevert(instance.startSale({from: bob}),
      "Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.");
  });

  it("should allow users to buy after sale starts", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    // Set up sale
    const startSaleResult = await instance.startSale({from: owner});
    expect(startSaleResult.receipt.status).to.equal(true);

    // Buy
    const buyResult = await instance.mint(
      {from: bob, value: web3.utils.toWei("0.069", "ether")});
    expect(buyResult.receipt.status).to.equal(true);

    // Confirm buy
    const numPoops = await instance.totalSupply({from: bob});
    expect(numPoops.toNumber()).to.equal(1);
  });

  it("should correctly create tokenURIs", async () => {
    const instance = await contractClass.new("https://some-thing.fission.app/json/");

    // Set up sale
    const startSaleResult = await instance.startSale({from: owner});
    expect(startSaleResult.receipt.status).to.equal(true);

    // Buy
    const buyResult = await instance.mint(
      {from: bob, value: web3.utils.toWei("0.069", "ether")});
    expect(buyResult.receipt.status).to.equal(true);

    const tokenURI = await instance.tokenURI(176);
    console.log("Spot check token URI:");
    console.log(tokenURI);
  });

  it("should require the correct price", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    // Set up the sale
    const startSaleResult = await instance.startSale({from: owner});
    expect(startSaleResult.receipt.status).to.equal(true);

    // Buy with no ETH
    await expectRevert(instance.mint({from: alice}),
      "Ether value required is 0.069");
  });

  // Paused by default, since the test takes 10mins to sell out supply
  xit("should allow buying all the way to max supply", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");
    await utils.advanceTimeAndBlock(300);

    const startSaleResult = await instance.startSale({from: owner});

    // Use up supply to max
    for (let i = 176; i <= 666; i++) {
      if(i % 20 == 0) {
        await utils.advanceTimeAndBlock(300);
      }
      let result = await instance.mint({
        from: bob, value: web3.utils.toWei("0.069", "ether")});
      expect(result.receipt.status).to.equal(true);
    }

    const nextPublicTokenId = await instance.getNextPublicTokenId();
    expect(nextPublicTokenId.toString()).to.equal("667");
    
  // Need to override the default wait period
  }).timeout(10000000);
});
