// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

contract FNTNConverter {
  /*
   * The tokenIds are not contiguous in the original contract
   * Given the id of a shard (the numner in the title, eg "FNTN // 62")
   * this outputs the actual tokenId in the original shared contract.
   */
  function shardIdToTokenId(uint shardId) public pure returns (uint) {
    // Check up front for a valid id. Saves gas on failure, but also on valid
    // shardIds we can save some gas by not needing SafeMath function calls
    require(shardId >= 1 && shardId <= 175, "Enter a shardId from 1 to 175");

    uint tokenId = 0;

    if (shardId == 1) {
      tokenId = 1203;
    } else if (shardId == 2) {
      tokenId = 1420;
    } else if (shardId >= 3 && shardId <= 5) {
      tokenId = 1229 + shardId;
    } else if (shardId >= 8 && shardId <= 36) {
      tokenId = 1230 + shardId;
    } else if (shardId >= 37 && shardId <= 58) {
      tokenId = 1231 + shardId;
    } else if (shardId >= 59 && shardId <= 62) {
      tokenId = 1231 + shardId; // TODO: Isn't this one just contiguous then?
    } else if (shardId >= 63 && shardId <= 75) {
      tokenId = 1242 + shardId;
    } else if (shardId >= 76 && shardId <= 146) {
      tokenId = 1344 + shardId;
    } else if (shardId >= 165 && shardId <= 175) {
      tokenId = 1129 + shardId;
    } else if (shardId == 175) {
      tokenId = 175;
    }

    return tokenId;
  }
  
  function tokenIdToShardId(uint tokenId) public pure returns (uint) {
    // Check up front for a valid id. Saves gas on failure, but also on valid
    // shardIds we can save some gas by not needing SafeMath function calls
    require(tokenId >= 1229 && tokenId <= 1420, "Enter a tokenId from 1229 to 1420");

    uint shardId = 0;

    if (tokenId == 1229) {
      shardId = 175;
    } else if (tokenId == 1230) {
      shardId = 1;
    } else if(tokenId >= 1232 && tokenId <= 1236) {
      shardId = tokenId - 1232 + 3;
    } else if(tokenId >= 1238 && tokenId <= 1266) {
      shardId = tokenId - 1238 + 8;
    } else if(tokenId >= 1268 && tokenId <= 1293) {
      shardId = tokenId - 1268 + 37;
    } else if(tokenId >= 1294 && tokenId <= 1296) {
      shardId = tokenId - 1294 + 165;
    } else if(tokenId == 1298) {
      shardId = 169;
    } else if(tokenId == 1299) {
       shardId = 170;
    } else if(tokenId == 1300) {
       shardId = 168;
    } else if(tokenId >= 1301 && tokenId <= 1304) {
      shardId = tokenId - 1301 + 171;
    } else if(tokenId >= 1305 && tokenId <= 1317) {
      shardId = tokenId - 1305 + 63;
    } else if(tokenId >= 1320 && tokenId <= 1352) {
      shardId = tokenId - 1320 + 76;
    } else if(tokenId >= 1354 && tokenId <= 1409) {
      shardId = tokenId - 1354 + 109;
    } else if(tokenId == 1420) {
      shardId = 2;
    }

    return shardId;
  }
}
