// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BookMarketplace is Ownable, ReentrancyGuard {
    struct Book {
        uint256 id;
        address payable uploader;
        address payable authorAddress;
        string title;
        string description;
        string cid; // IPFS CID
        uint256 price;
    }

    uint256 public nextBookId;
    mapping(uint256 => Book) public books;
    mapping(address => uint256[]) public userPurchases;

    event BookPurchased(uint256 indexed bookId, address indexed buyer);
    event BookDeleted(uint256 indexed bookId);
    event BookListed(
        uint256 indexed bookId,
        address indexed author,
        string title,
        uint256 price
    );

    constructor() Ownable(msg.sender) {}

    function addBook(
        string memory title,
        string memory description,
        string memory cid,
        uint256 price,
        address payable authorAddress
    ) external {
        require(price > 0, "Price must be greater than 0");
        require(authorAddress != address(0), "Invalid author address");

        uint256 bookId = nextBookId++;
        books[bookId] = Book(
            bookId,
            payable(msg.sender),
            authorAddress,
            title,
            description,
            cid,
            price
        );

        emit BookListed(bookId, msg.sender, title, price);
    }

    function purchaseBook(uint256 bookId) external payable nonReentrant {
        Book memory book = books[bookId];

        // Validate book existence
        require(book.authorAddress != address(0), "Book does not exist");

        // Validate payment
        require(msg.value == book.price, "Incorrect payment amount");

        // Transfer funds to the author
        book.authorAddress.transfer(msg.value);

        // Record purchase
        userPurchases[msg.sender].push(bookId);

        emit BookPurchased(bookId, msg.sender);
    }

    function getMyBooks() external view returns (uint256[] memory) {
        return userPurchases[msg.sender];
    }

    function getAllBooks() external view returns (Book[] memory) {
        Book[] memory result = new Book[](nextBookId);
        for (uint i = 0; i < nextBookId; i++) {
            result[i] = books[i];
        }
        return result;
    }

    function getBook(uint256 bookId) external view returns (Book memory) {
        return books[bookId];
    }

    function deleteBook(uint256 bookId) external {
        require(books[bookId].uploader != address(0), "Book does not exist");
        require(
            books[bookId].uploader == msg.sender || owner() == msg.sender,
            "Only uploader or owner can delete this book"
        );

        delete books[bookId];
        emit BookDeleted(bookId);
    }
}
