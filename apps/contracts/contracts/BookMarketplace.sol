// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BookMarketplace is Ownable, ReentrancyGuard {
    struct Book {
        uint256 id;
        address author;
        string title;
        string cid;
        uint256 price;
    }

    uint256 public nextBookId;
    mapping(uint256 => Book) public books;
    mapping(address => uint256[]) public userPurchases;

    event BookPurchased(uint256 indexed bookId, address indexed buyer);
    event BookListed(
        uint256 indexed bookId,
        address indexed author,
        string title,
        uint256 price
    );

    constructor() Ownable(msg.sender) {}

    function listBook(
        string memory title,
        string memory cid,
        uint256 price
    ) external {
        require(price > 0, "Price must be greater than 0");

        uint256 bookId = nextBookId++;
        books[bookId] = Book(bookId, msg.sender, title, cid, price);

        emit BookListed(bookId, msg.sender, title, price);
    }

    function purchaseBook(uint256 bookId) external payable nonReentrant {
        Book memory book = books[bookId];
        require(book.author != address(0), "Book does not exist");
        require(msg.value == book.price, "Incorrect payment amount");

        payable(book.author).transfer(msg.value);
        userPurchases[book.author].push(bookId);
        emit BookPurchased(bookId, msg.sender);
    }

    function getMyBooks() external view returns (uint256[] memory) {
        return userPurchases[msg.sender];
    }
}
