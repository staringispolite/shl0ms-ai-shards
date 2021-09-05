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
   * Main function for the NFT sale
   *
   * Prerequisites
   *  - Not at max supply
   *  - Sale has started
   */
  function mint() external payable nonReentrant {
    require(nextTokenId <= MAX_TOKENS, "We are at max supply");
    require(hasSaleStarted, "Sale hasn't started");
    require(msg.value == SHARD_PRICE, "Ether value required is 0.069");

    _safeMint(msg.sender, nextTokenId++);
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

    string memory base = baseURI();
    string memory fragment = Strings.strConcat(Strings.uint2str(tokenId), "/index.json");
    
    return Strings.strConcat(base, fragment);
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
