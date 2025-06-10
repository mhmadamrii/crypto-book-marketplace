// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BookMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _bookIds;

    address public owner;

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
        string metadataURI; // IPFS URI
        uint256 price;
        uint256 royaltyPercent;
        bool exists;
    }

    constructor() {
        owner = msg.sender;
    }

    function createBook(
        string memory _metadataURI,
        uint256 _price,
        uint256 _royaltyPercent
    ) external {
        require(_price > 0, "Price must be greater than zero");
        require(_royaltyPercent <= 100, "Royalty too high");

        uint256 bookId = _bookIdCounter.current();
        books[bookId] = Book({
            id: bookId,
            author: payable(msg.sender),
            metadataURI: _metadataURI,
            price: _price,
            royaltyPercent: _royaltyPercent,
            exists: true
        });

        _bookIdCounter.increment();
        emit BookCreated(bookId, msg.sender, _price);
    }

    function buyBook(uint256 _bookId) external payable nonReentrant {
        Book memory book = books[_bookId];
        require(book.exists, "Book does not exist");
        require(msg.value == book.price, "Incorrect pyament amount");

        book.author.transfer(book.price);
        emit BookPurchased(_bookId, msg.sender, book.price);
    }

    function getAllBooks() external view returns (Book[] memory) {
        Book[] memory allBooks = new Book[](_bookIdCounter.current());
        uint256 i = 0;
        for (uint256 bookId = 1; bookId <= _bookIdCounter.current(); bookId++) {
            Book memory book = books[bookId];
            if (book.exists) {
                allBooks[i] = book;
                i++;
            }
        }
        return allBooks;
    }
}
