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

const shardToFNTN = {
  1: 1230,
  2: 1420,
  3: 1232,
  4: 1233,
  5: 1234,
  6: 1235,
  7: 1236,
  8: 1238,
  9: 1239,
  10: 1240,
  11: 1241,
  12: 1242,
  13: 1243,
  14: 1244,
  15: 1245,
  16: 1246,
  17: 1247,
  18: 1248,
  19: 1249,
  20: 1250,
  21: 1251,
  22: 1252,
  23: 1253,
  24: 1254,
  25: 1255,
  26: 1256,
  27: 1257,
  28: 1258,
  29: 1259,
  30: 1260,
  31: 1261,
  32: 1262,
  33: 1263,
  34: 1264,
  35: 1265,
  36: 1266,
  37: 1268,
  38: 1269,
  39: 1270,
  40: 1271,
  41: 1272,
  42: 1273,
  43: 1274,
  44: 1275,
  45: 1276,
  46: 1277,
  47: 1278,
  48: 1279,
  49: 1280,
  50: 1281,
  51: 1282,
  52: 1283,
  53: 1284,
  54: 1285,
  55: 1286,
  56: 1287,
  57: 1288,
  58: 1289,
  59: 1290,
  60: 1291,
  61: 1292,
  62: 1293,
  63: 1305,
  64: 1306,
  65: 1307,
  66: 1308,
  67: 1309,
  68: 1310,
  69: 1311,
  70: 1312,
  71: 1313,
  72: 1314,
  73: 1315,
  74: 1316,
  75: 1317,
  76: 1320,
  77: 1321,
  78: 1322,
  79: 1323,
  80: 1324,
  81: 1325,
  82: 1326,
  83: 1327,
  84: 1328,
  85: 1329,
  86: 1330,
  87: 1331,
  88: 1332,
  89: 1333,
  90: 1334,
  91: 1335,
  92: 1336,
  93: 1337,
  94: 1338,
  95: 1339,
  96: 1340,
  97: 1341,
  98: 1342,
  99: 1343,
  100: 1344,
  101: 1345,
  102: 1346,
  103: 1347,
  104: 1348,
  105: 1349,
  106: 1350,
  107: 1351,
  108: 1352,
  109: 1354,
  110: 1355,
  111: 1356,
  112: 1357,
  113: 1358,
  114: 1359,
  115: 1360,
  116: 1361,
  117: 1362,
  118: 1363,
  119: 1364,
  120: 1365,
  121: 1366,
  122: 1367,
  123: 1368,
  124: 1369,
  125: 1370,
  126: 1371,
  127: 1372,
  128: 1373,
  129: 1374,
  130: 1375,
  131: 1376,
  132: 1377,
  133: 1378,
  134: 1379,
  135: 1380,
  136: 1381,
  137: 1382,
  138: 1383,
  139: 1384,
  140: 1385,
  141: 1386,
  142: 1387,
  143: 1388,
  144: 1389,
  145: 1390,
  146: 1391,
  147: 1392,
  148: 1393,
  149: 1394,
  150: 1395,
  151: 1396,
  152: 1397,
  153: 1398,
  154: 1399,
  155: 1400,
  156: 1401,
  157: 1402,
  158: 1403,
  159: 1404,
  160: 1405,
  161: 1406,
  162: 1407,
  163: 1408,
  164: 1409,
  165: 1294,
  166: 1295,
  167: 1296,
  168: 1300,
  169: 1298,
  170: 1299,
  171: 1301,
  172: 1302,
  173: 1303,
  174: 1304,
  175: 1229,
};

const FNTNToShard = {
  1230: 1,
  1420: 2,
  1232: 3,
  1233: 4,
  1234: 5,
  1235: 6,
  1236: 7,
  1238: 8,
  1239: 9,
  1240: 10,
  1241: 11,
  1242: 12,
  1243: 13,
  1244: 14,
  1245: 15,
  1246: 16,
  1247: 17,
  1248: 18,
  1249: 19,
  1250: 20,
  1251: 21,
  1252: 22,
  1253: 23,
  1254: 24,
  1255: 25,
  1256: 26,
  1257: 27,
  1258: 28,
  1259: 29,
  1260: 30,
  1261: 31,
  1262: 32,
  1263: 33,
  1264: 34,
  1265: 35,
  1266: 36,
  1268: 37,
  1269: 38,
  1270: 39,
  1271: 40,
  1272: 41,
  1273: 42,
  1274: 43,
  1275: 44,
  1276: 45,
  1277: 46,
  1278: 47,
  1279: 48,
  1280: 49,
  1281: 50,
  1282: 51,
  1283: 52,
  1284: 53,
  1285: 54,
  1286: 55,
  1287: 56,
  1288: 57,
  1289: 58,
  1290: 59,
  1291: 60,
  1292: 61,
  1293: 62,
  1305: 63,
  1306: 64,
  1307: 65,
  1308: 66,
  1309: 67,
  1310: 68,
  1311: 69,
  1312: 70,
  1313: 71,
  1314: 72,
  1315: 73,
  1316: 74,
  1317: 75,
  1320: 76,
  1321: 77,
  1322: 78,
  1323: 79,
  1324: 80,
  1325: 81,
  1326: 82,
  1327: 83,
  1328: 84,
  1329: 85,
  1330: 86,
  1331: 87,
  1332: 88,
  1333: 89,
  1334: 90,
  1335: 91,
  1336: 92,
  1337: 93,
  1338: 94,
  1339: 95,
  1340: 96,
  1341: 97,
  1342: 98,
  1343: 99,
  1344: 100,
  1345: 101,
  1346: 102,
  1347: 103,
  1348: 104,
  1349: 105,
  1350: 106,
  1351: 107,
  1352: 108,
  1354: 109,
  1355: 110,
  1356: 111,
  1357: 112,
  1358: 113,
  1359: 114,
  1360: 115,
  1361: 116,
  1362: 117,
  1363: 118,
  1364: 119,
  1365: 120,
  1366: 121,
  1367: 122,
  1368: 123,
  1369: 124,
  1370: 125,
  1371: 126,
  1372: 127,
  1373: 128,
  1374: 129,
  1375: 130,
  1376: 131,
  1377: 132,
  1378: 133,
  1379: 134,
  1380: 135,
  1381: 136,
  1382: 137,
  1383: 138,
  1384: 139,
  1385: 140,
  1386: 141,
  1387: 142,
  1388: 143,
  1389: 144,
  1390: 145,
  1391: 146,
  1392: 147,
  1393: 148,
  1394: 149,
  1395: 150,
  1396: 151,
  1397: 152,
  1398: 153,
  1399: 154,
  1400: 155,
  1401: 156,
  1402: 157,
  1403: 158,
  1404: 159,
  1405: 160,
  1406: 161,
  1407: 162,
  1408: 163,
  1409: 164,
  1294: 165,
  1295: 166,
  1296: 167,
  1300: 168,
  1298: 169,
  1299: 170,
  1301: 171,
  1302: 172,
  1303: 173,
  1304: 174,
  1229: 175,
};

const contractClass = artifacts.require('ThisShardDoesNotExist');
const utils = require('./helpers/util');

contract("ThisShardDoesNotExist", async (accounts) => {
  let [owner, alice, bob] = accounts;

  it("Should correctly convert from shard number => FNTN contract tokenId", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    for (let id in shardToFNTN) {
      let tokenId = await instance.shardIdToTokenId(id);
      expect(tokenId.toString()).to.equal(shardToFNTN[id].toString());
    }
  });

  it("Should correctly convert from FNTN contract tokenIds to shard number", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    for (let id in FNTNToShard) {
      let shardId = await instance.tokenIdToShardId(id);
      expect(shardId.toString()).to.equal(FNTNToShard[id].toString());
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

  it("should allow owner to set a new contract address", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    const txn = await instance.setFntnContract(alice, {from: owner});
    expect(txn.receipt.status).to.equal(true);

    const newContract = await instance.getFntnContract();
    expect(newContract).to.equal(alice);
  });

  it("should not allow non-owners to set a new contract address", async () => {
    const instance = await contractClass.new("https://nftapi.com/metadata/");

    await expectRevert(instance.setFntnContract(alice, {from: bob}),
      "Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.");
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
