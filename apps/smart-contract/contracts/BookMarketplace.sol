// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BookMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _bookIds;

    mapping(uint256 => Book) public books;
    mapping(address => uint256[]) public ownedBooks;

    event BookCreated(
        uint256 indexed bookId,
        address indexed author,
        uint256 price
    );
    event BookPurchased(
        uint256 indexed bookId,
        address indexed buyer,
        uint256 price
    );

    struct Book {
        uint256 id;
        address payable author;
        string ipfsMetadataHash;
        uint256 price;
        uint256 royaltyPercent;
        bool exists;
    }

    function createBook(
        string memory _metadataURI,
        uint256 _price,
        uint256 _royaltyPercent
    ) external {
        require(_price > 0, "Price must be greater than zero");
        require(_royaltyPercent <= 100, "Royalty too high");

        uint256 bookId = _bookIdCounter.current();
    }
}
