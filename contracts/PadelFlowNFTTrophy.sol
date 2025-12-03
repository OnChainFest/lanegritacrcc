// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PadelFlowNFTTrophy
 * @dev NFT Trophy contract for PadelFlow tournament winners
 *
 * Features:
 * - Mint NFT trophies for tournament winners
 * - Store tournament metadata on-chain
 * - Support for multiple winners per tournament
 * - Pausable for emergency situations
 * - Owner-controlled minting (tournament organizer)
 */
contract PadelFlowNFTTrophy is ERC721, ERC721URIStorage, Ownable, Pausable {
    using Counters for Counters.Counter;

    // Token ID counter
    Counters.Counter private _tokenIdCounter;

    // Tournament information struct
    struct TournamentInfo {
        string tournamentId;      // PadelFlow tournament ID
        string tournamentName;    // Tournament name
        uint256 place;            // Winner's place (1st, 2nd, 3rd, etc.)
        string winnerName;        // Winner's display name
        uint256 timestamp;        // Timestamp when NFT was minted
        string metadataURI;       // IPFS or HTTP URI for metadata
    }

    // Mapping from token ID to tournament info
    mapping(uint256 => TournamentInfo) public tokenTournamentInfo;

    // Mapping from tournament ID to array of minted token IDs
    mapping(string => uint256[]) public tournamentTokens;

    // Mapping to check if a wallet has already received a trophy for a specific tournament
    mapping(address => mapping(string => bool)) public hasReceivedTrophy;

    // Events
    event TrophyMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string tournamentId,
        string tournamentName,
        uint256 place,
        string winnerName
    );

    event TrophyBatchMinted(
        string indexed tournamentId,
        uint256[] tokenIds,
        address[] recipients
    );

    /**
     * @dev Constructor
     * @param initialOwner Address of the contract owner (typically the PadelFlow platform)
     */
    constructor(address initialOwner) ERC721("PadelFlow Trophy", "PFTROPHY") Ownable(initialOwner) {
        // Token counter starts at 1
        _tokenIdCounter.increment();
    }

    /**
     * @dev Mint a single NFT trophy to a winner
     * @param recipient Address of the winner
     * @param tournamentId PadelFlow tournament ID
     * @param tournamentName Name of the tournament
     * @param place Winner's place (1, 2, 3, etc.)
     * @param winnerName Winner's display name
     * @param metadataURI IPFS or HTTP URI for NFT metadata
     * @return tokenId The ID of the minted token
     */
    function mint(
        address recipient,
        string memory tournamentId,
        string memory tournamentName,
        uint256 place,
        string memory winnerName,
        string memory metadataURI
    ) public onlyOwner whenNotPaused returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(tournamentId).length > 0, "Tournament ID required");
        require(bytes(tournamentName).length > 0, "Tournament name required");
        require(place > 0, "Place must be greater than 0");
        require(bytes(winnerName).length > 0, "Winner name required");
        require(!hasReceivedTrophy[recipient][tournamentId], "Recipient already has trophy for this tournament");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Mint the NFT
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // Store tournament information
        tokenTournamentInfo[tokenId] = TournamentInfo({
            tournamentId: tournamentId,
            tournamentName: tournamentName,
            place: place,
            winnerName: winnerName,
            timestamp: block.timestamp,
            metadataURI: metadataURI
        });

        // Add token to tournament tokens list
        tournamentTokens[tournamentId].push(tokenId);

        // Mark recipient as having received trophy
        hasReceivedTrophy[recipient][tournamentId] = true;

        emit TrophyMinted(tokenId, recipient, tournamentId, tournamentName, place, winnerName);

        return tokenId;
    }

    /**
     * @dev Mint multiple NFT trophies for a tournament (batch minting)
     * @param recipients Array of winner addresses
     * @param tournamentId PadelFlow tournament ID
     * @param tournamentName Name of the tournament
     * @param places Array of winner places (1, 2, 3, etc.)
     * @param winnerNames Array of winner display names
     * @param metadataURIs Array of IPFS or HTTP URIs for NFT metadata
     * @return tokenIds Array of minted token IDs
     */
    function mintBatch(
        address[] memory recipients,
        string memory tournamentId,
        string memory tournamentName,
        uint256[] memory places,
        string[] memory winnerNames,
        string[] memory metadataURIs
    ) public onlyOwner whenNotPaused returns (uint256[] memory) {
        require(recipients.length > 0, "No recipients provided");
        require(recipients.length == places.length, "Recipients and places length mismatch");
        require(recipients.length == winnerNames.length, "Recipients and names length mismatch");
        require(recipients.length == metadataURIs.length, "Recipients and URIs length mismatch");

        uint256[] memory tokenIds = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            tokenIds[i] = mint(
                recipients[i],
                tournamentId,
                tournamentName,
                places[i],
                winnerNames[i],
                metadataURIs[i]
            );
        }

        emit TrophyBatchMinted(tournamentId, tokenIds, recipients);

        return tokenIds;
    }

    /**
     * @dev Get all token IDs for a specific tournament
     * @param tournamentId PadelFlow tournament ID
     * @return Array of token IDs
     */
    function getTournamentTokens(string memory tournamentId) public view returns (uint256[] memory) {
        return tournamentTokens[tournamentId];
    }

    /**
     * @dev Get tournament information for a specific token
     * @param tokenId Token ID
     * @return TournamentInfo struct
     */
    function getTournamentInfo(uint256 tokenId) public view returns (TournamentInfo memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenTournamentInfo[tokenId];
    }

    /**
     * @dev Get total number of minted trophies
     * @return Total count of minted tokens
     */
    function totalMinted() public view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }

    /**
     * @dev Pause the contract (emergency use)
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Override required by Solidity for ERC721URIStorage
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override required by Solidity for ERC721URIStorage
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
