import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const BookMarketplaceModule = buildModule("BookMarketplaceModule", (m) => {
  const bookMarketplace = m.contract("BookMarketplace", []);

  return {bookMarketplace};
});

export default BookMarketplaceModule;
