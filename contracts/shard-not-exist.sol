// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

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
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface FntnInterface {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract ThisShardDoesNotExist is ERC721Enumerable, Ownable, ReentrancyGuard, IERC2981 {
    string private baseURI = "";

    // Max NFTs total
    uint256 public constant MAX_TOKENS = 666;

    // Price in gwei per shard (0.069 ETH)
    uint256 public constant SHARD_PRICE = 69000000000000000;

    // Allow for starting/pausing sale
    bool public hasSaleStarted = false;

    // Next tokenId eligible to be minted
    // First 175 are reserved for shard-hodlers
    uint256 internal nextTokenId = 176;

    // Next tokenId eligible to be minted
    // First 175 are reserved for shard-hodlers
    uint8 internal royaltyBPS = 100;

    //FNTN Contract
    FntnInterface fntnContract =
        FntnInterface(0x2Fb704d243cFA179fFaD4D87AcB1D36bcf243a44);

    /*
     * Set up the basics
     *
     * @dev It will NOT be ready to start sale immediately upon deploy
     */
    constructor(string memory _baseURI)
        ERC721("This Shard Does Not Exist", "AIFNTN")
    {
        baseURI = _baseURI;
    }

    function royaltyInfo(
        uint256,
        uint256 _salePrice
    ) override external view returns (
        address receiver,
        uint256 royaltyAmount
    ) {
        return (
            owner(),
            (_salePrice * royaltyBPS) / 10_000
        );
    }

    function updateRoyaltyBPS(uint8 newRoyaltyBPS) public onlyOwner {
        require(royaltyBPS <= 300, "No greater 30%");
        royaltyBPS = newRoyaltyBPS;
    }

    /*
     * Get the tokens owned by _owner
     */
    function tokensOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
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
    function mintWithShard(uint256 shardId) external payable nonReentrant {
        require(hasSaleStarted, "Sale hasn't started");
        require(msg.value == SHARD_PRICE, "Ether value required is 0.069");
        // Duplicate this here to potentially save people gas
        require(
            shardId >= 1 && shardId <= 175,
            "Enter a shardId from 1 to 175"
        );

        // Get FNTN tokenId from shard number
        uint256 fntnId = shardIdToTokenId(shardId);

        // Ensure sender owns shard in question
        require(
            fntnContract.ownerOf(fntnId) == msg.sender,
            "Not the owner of this shard"
        );

        // Mint if token doesn't exist
        require(!_exists(shardId), "This token has already been minted");
        _safeMint(msg.sender, shardId);
    }

    /*
     * The tokenIds are not contiguous in the original contract
     * Given the id of a shard (the numner in the title, eg "FNTN // 62")
     * this outputs the actual tokenId in the original shared contract.
     */
    function shardIdToTokenId(uint256 shardId) public pure returns (uint256) {
        // Check up front for a valid id. Saves gas on failure, but also on valid
        // shardIds we can save some gas by not needing SafeMath function calls
        require(
            shardId >= 1 && shardId <= 175,
            "Enter a shardId from 1 to 175"
        );

        uint256 tokenId = 0;

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

    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, IERC165)
        returns (bool)
    {
        return
            type(IERC2981).interfaceId == interfaceId ||
            ERC721Enumerable.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return
            string(
                abi.encodePacked(
                    baseURI,
                    Strings.toString(tokenId),
                    "/index.json"
                )
            );
    }

    // Admin functions
    function setBaseURI(string memory _baseURI) public onlyOwner {
      baseURI = _baseURI;
    }

    function getNextPublicTokenId() public view returns (uint256) {
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
