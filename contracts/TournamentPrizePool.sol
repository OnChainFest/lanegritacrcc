// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TournamentPrizePool
 * @notice Smart contract for managing PadelFlow tournament prize pools
 * @dev Handles escrow and automatic distribution of prizes to winners
 *
 * Features:
 * - Secure escrow of tournament prize pool
 * - Automatic distribution to top 3 winners
 * - Flexible prize distribution percentages
 * - Support for all tournament formats (Americano, Round Robin, Eliminación, Liga)
 * - Emergency withdrawal for organizer
 * - Event emission for transparency
 */
contract TournamentPrizePool is Ownable, ReentrancyGuard {

    // Tournament metadata
    string public tournamentName;
    string public tournamentFormat;
    uint256 public tournamentId;

    // Prize pool state
    uint256 public totalPrizePool;
    bool public prizesDistributed;
    uint256 public distributionTimestamp;

    // Winners
    address public firstPlaceWinner;
    address public secondPlaceWinner;
    address public thirdPlaceWinner;

    // Prize amounts
    uint256 public firstPlacePrize;
    uint256 public secondPlacePrize;
    uint256 public thirdPlacePrize;

    // Events
    event PrizePoolFunded(address indexed funder, uint256 amount, uint256 timestamp);
    event WinnersSet(
        address indexed first,
        address indexed second,
        address indexed third,
        uint256 timestamp
    );
    event PrizesDistributed(
        address indexed first,
        uint256 firstAmount,
        address indexed second,
        uint256 secondAmount,
        address indexed third,
        uint256 thirdAmount,
        uint256 timestamp
    );
    event EmergencyWithdrawal(address indexed owner, uint256 amount, uint256 timestamp);

    /**
     * @notice Initialize the tournament prize pool contract
     * @param _tournamentId Unique identifier for the tournament
     * @param _tournamentName Name of the tournament
     * @param _tournamentFormat Format type (americano, round-robin, eliminacion, liga)
     * @param _organizer Address of the tournament organizer (becomes owner)
     */
    constructor(
        uint256 _tournamentId,
        string memory _tournamentName,
        string memory _tournamentFormat,
        address _organizer
    ) Ownable(_organizer) {
        require(_organizer != address(0), "Invalid organizer address");
        require(_tournamentId > 0, "Invalid tournament ID");

        tournamentId = _tournamentId;
        tournamentName = _tournamentName;
        tournamentFormat = _tournamentFormat;
        prizesDistributed = false;
    }

    /**
     * @notice Fund the prize pool with ETH or native token
     * @dev Can be called multiple times to add more funds
     */
    function fundPrizePool() external payable onlyOwner {
        require(msg.value > 0, "Must send funds");
        require(!prizesDistributed, "Prizes already distributed");

        totalPrizePool += msg.value;

        emit PrizePoolFunded(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice Set the winners and calculate prize distribution
     * @param _firstPlace Wallet address of 1st place winner
     * @param _secondPlace Wallet address of 2nd place winner
     * @param _thirdPlace Wallet address of 3rd place winner
     * @param _percentages Array of 3 percentages for distribution [first, second, third]
     *                     Must add up to 100. Example: [50, 30, 20] or [60, 30, 10]
     */
    function setWinners(
        address _firstPlace,
        address _secondPlace,
        address _thirdPlace,
        uint8[3] memory _percentages
    ) external onlyOwner {
        require(!prizesDistributed, "Prizes already distributed");
        require(totalPrizePool > 0, "Prize pool is empty");

        // Validate addresses
        require(_firstPlace != address(0), "Invalid 1st place address");
        require(_secondPlace != address(0), "Invalid 2nd place address");
        require(_thirdPlace != address(0), "Invalid 3rd place address");
        require(_firstPlace != _secondPlace, "Winners must be different");
        require(_firstPlace != _thirdPlace, "Winners must be different");
        require(_secondPlace != _thirdPlace, "Winners must be different");

        // Validate percentages (must add up to 100)
        uint8 totalPercentage = _percentages[0] + _percentages[1] + _percentages[2];
        require(totalPercentage == 100, "Percentages must add up to 100");
        require(_percentages[0] >= _percentages[1], "1st prize must be >= 2nd");
        require(_percentages[1] >= _percentages[2], "2nd prize must be >= 3rd");

        // Set winners
        firstPlaceWinner = _firstPlace;
        secondPlaceWinner = _secondPlace;
        thirdPlaceWinner = _thirdPlace;

        // Calculate prize amounts
        firstPlacePrize = (totalPrizePool * _percentages[0]) / 100;
        secondPlacePrize = (totalPrizePool * _percentages[1]) / 100;
        thirdPlacePrize = (totalPrizePool * _percentages[2]) / 100;

        emit WinnersSet(_firstPlace, _secondPlace, _thirdPlace, block.timestamp);
    }

    /**
     * @notice Distribute prizes to all winners
     * @dev Can only be called once. Uses pull-over-push pattern for security
     */
    function distributePrizes() external onlyOwner nonReentrant {
        require(!prizesDistributed, "Prizes already distributed");
        require(firstPlaceWinner != address(0), "Winners not set");
        require(totalPrizePool > 0, "Prize pool is empty");

        // Mark as distributed first (checks-effects-interactions pattern)
        prizesDistributed = true;
        distributionTimestamp = block.timestamp;

        // Calculate actual amounts to send (handle rounding)
        uint256 firstAmount = firstPlacePrize;
        uint256 secondAmount = secondPlacePrize;
        uint256 thirdAmount = thirdPlacePrize;

        // Send any remaining wei to first place (handle rounding dust)
        uint256 totalDistributed = firstAmount + secondAmount + thirdAmount;
        if (totalDistributed < totalPrizePool) {
            firstAmount += (totalPrizePool - totalDistributed);
        }

        // Transfer funds
        (bool success1, ) = payable(firstPlaceWinner).call{value: firstAmount}("");
        require(success1, "Transfer to 1st place failed");

        (bool success2, ) = payable(secondPlaceWinner).call{value: secondAmount}("");
        require(success2, "Transfer to 2nd place failed");

        (bool success3, ) = payable(thirdPlaceWinner).call{value: thirdAmount}("");
        require(success3, "Transfer to 3rd place failed");

        emit PrizesDistributed(
            firstPlaceWinner,
            firstAmount,
            secondPlaceWinner,
            secondAmount,
            thirdPlaceWinner,
            thirdAmount,
            block.timestamp
        );
    }

    /**
     * @notice Emergency withdrawal for organizer if prizes haven't been distributed
     * @dev Only callable by owner and only before distribution
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        require(!prizesDistributed, "Prizes already distributed");
        require(totalPrizePool > 0, "No funds to withdraw");

        uint256 amount = totalPrizePool;
        totalPrizePool = 0;

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Emergency withdrawal failed");

        emit EmergencyWithdrawal(owner(), amount, block.timestamp);
    }

    /**
     * @notice Get contract balance
     * @return Current contract balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get tournament information
     * @return Tournament ID, name, format, and prize pool
     */
    function getTournamentInfo() external view returns (
        uint256 id,
        string memory name,
        string memory format,
        uint256 prizePool,
        bool distributed
    ) {
        return (
            tournamentId,
            tournamentName,
            tournamentFormat,
            totalPrizePool,
            prizesDistributed
        );
    }

    /**
     * @notice Get winners information
     * @return Addresses and prize amounts for all winners
     */
    function getWinners() external view returns (
        address first,
        uint256 firstPrize,
        address second,
        uint256 secondPrize,
        address third,
        uint256 thirdPrize
    ) {
        return (
            firstPlaceWinner,
            firstPlacePrize,
            secondPlaceWinner,
            secondPlacePrize,
            thirdPlaceWinner,
            thirdPlacePrize
        );
    }

    /**
     * @notice Fallback function to receive ETH
     */
    receive() external payable {
        require(!prizesDistributed, "Prizes already distributed");
        totalPrizePool += msg.value;
        emit PrizePoolFunded(msg.sender, msg.value, block.timestamp);
    }
}
