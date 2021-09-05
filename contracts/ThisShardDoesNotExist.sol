// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

// @title: This Shard Does Not Exist
// @author: Jonathan Howard

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                                                                         //
// ████████╗██╗░░██╗██╗░██████╗  ░██████╗██╗░░██╗░█████╗░██████╗░██████╗░  //
// ╚══██╔══╝██║░░██║██║██╔════╝  ██╔════╝██║░░██║██╔══██╗██╔══██╗██╔══██╗  //
// ░░░██║░░░███████║██║╚█████╗░  ╚█████╗░███████║███████║██████╔╝██║░░██║  //
// ░░░██║░░░██╔══██║██║░╚═══██╗  ░╚═══██╗██╔══██║██╔══██║██╔══██╗██║░░██║  //
// ░░░██║░░░██║░░██║██║██████╔╝  ██████╔╝██║░░██║██║░░██║██║░░██║██████╔╝  //
// ░░░╚═╝░░░╚═╝░░╚═╝╚═╝╚═════╝░  ╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░  //
//                                                                         //
//      ██████╗░░█████╗░███████╗░██████╗  ███╗░░██╗░█████╗░████████╗       //
//      ██╔══██╗██╔══██╗██╔════╝██╔════╝  ████╗░██║██╔══██╗╚══██╔══╝       //
//      ██║░░██║██║░░██║█████╗░░╚█████╗░  ██╔██╗██║██║░░██║░░░██║░░░       //
//      ██║░░██║██║░░██║██╔══╝░░░╚═══██╗  ██║╚████║██║░░██║░░░██║░░░       //
//      ██████╔╝╚█████╔╝███████╗██████╔╝  ██║░╚███║╚█████╔╝░░░██║░░░       //
//      ╚═════╝░░╚════╝░╚══════╝╚═════╝░  ╚═╝░░╚══╝░╚════╝░░░░╚═╝░░░       //
//                                                                         //
//                ███████╗██╗░░██╗██╗░██████╗████████╗                     //
//                ██╔════╝╚██╗██╔╝██║██╔════╝╚══██╔══╝                     //
//                █████╗░░░╚███╔╝░██║╚█████╗░░░░██║░░░                     //
//                ██╔══╝░░░██╔██╗░██║░╚═══██╗░░░██║░░░                     //
//                ███████╗██╔╝╚██╗██║██████╔╝░░░██║░░░                     //
//                ╚══════╝╚═╝░░╚═╝╚═╝╚═════╝░░░░╚═╝░░░                     //
//                                                                         //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

// OpenZeppelin
import "./token/ERC721/ERC721.sol";
import "./access/Ownable.sol";
import "./security/ReentrancyGuard.sol";
import "./introspection/ERC165.sol";
import "./utils/Strings.sol";
import "./access/Ownable.sol";

interface FntnInterface {
  function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract ThisShardDoesNotExist is ERC721, Ownable, ReentrancyGuard {
  using SafeMath for uint8;
  using SafeMath for uint256;
  using Strings for string;

  // Max NFTs total
  uint public constant MAX_TOKENS = 666;

  // Price in gwei per shard (0.069 ETH)
  uint public constant SHARD_PRICE = 69000000000000000;

  // Allow for starting/pausing sale
  bool public hasSaleStarted = false;

  // Next tokenId eligible to be minted
  // First 175 are reserved for shard-hodlers
  uint internal nextTokenId = 176;

  //FNTN Contract
  address public fntnAddress = 0x2Fb704d243cFA179fFaD4D87AcB1D36bcf243a44;
  FntnInterface fntnContract = FntnInterface(fntnAddress);

  /*
   * Set up the basics
   *
   * @dev It will NOT be ready to start sale immediately upon deploy
   */
  constructor(string memory baseURI) ERC721("This Shard Does Not Exist","AIFNTN") {
    setBaseURI(baseURI);
  }

  /*
   * Get the tokens owned by _owner
   */
  function tokensOfOwner(address _owner) external view returns(uint256[] memory ) {
    uint256 tokenCount = balanceOf(_owner);
    if (tokenCount == 0) {
      // Return an empty array
      return new uint256[](0);
    } else {
      uint256[] memory result = new uint256[](tokenCount);
      uint256 index;
      for (index = 0; index < tokenCount; index++) {
        result[index] = tokenOfOwnerByIndex(_owner, index);
      }
      return result;
    }
  }

  /*
   * Main function for the sale
   *
   * prerequisites
   *  - not at max supply
   *  - sale has started
   */
  function mint() external payable nonReentrant {
    require(nextTokenId <= MAX_TOKENS, "We are at max supply");
    require(hasSaleStarted, "Sale hasn't started");
    require(msg.value == SHARD_PRICE, "Ether value required is 0.069");

    _safeMint(msg.sender, nextTokenId++);
  }

  /*
   * Buy the token reserved for your shard
   *
   * Prerequisites:
   *  - not at max supply
   *  - sale has started
   *  - your wallet owns the shard ID in question
   *
   * Example input: To mint for FNTN // 137, you would input 137
   */
  function mintWithShard(uint shardId) external payable nonReentrant {
    require(hasSaleStarted, "Sale hasn't started");
    require(msg.value == SHARD_PRICE, "Ether value required is 0.069");
    // Duplicate this here to potentially save people gas
    require(shardId >= 1 && shardId <= 175, "Enter a shardId from 1 to 175");

    // Get FNTN tokenId from shard number
    uint fntnId = shardIdToTokenId(shardId);

    // Ensure sender owns shard in question
    require(fntnContract.ownerOf(fntnId) == msg.sender, "Not the owner of this shard");

    // Mint if token doesn't exist
    require(!_exists(shardId), "This token has already been minted");
    _safeMint(msg.sender, shardId);
  }

  /*
   * The tokenIds are not contiguous in the original contract
   * Given the id of a shard (the numner in the title, eg "FNTN // 62")
   * this outputs the actual tokenId in the original shared contract.
   */
  function shardIdToTokenId(uint shardId) public view returns (uint) {
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

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view override(ERC165) returns (bool) {
    return ERC165.supportsInterface(interfaceId);
  }

  /**
   * @dev See {IERC721Metadata-tokenURI}.
   */
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    return string(abi.encodePacked(
			baseURI(),
			Strings.toString(tokenId),
			"/index.json"
		));
  }
    

  // Admin functions
  function setBaseURI(string memory baseURI) public onlyOwner {
    _setBaseURI(baseURI);
  }

  function getNextPublicTokenId() public view returns(uint) {
    return nextTokenId;
  }

  function startSale() public onlyOwner {
    hasSaleStarted = true;
  }

  function pauseSale() public onlyOwner {
    hasSaleStarted = false;
  }

  function withdrawAll() public payable onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
  }
}
