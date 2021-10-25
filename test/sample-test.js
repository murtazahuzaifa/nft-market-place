const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", () => {

  it("it should create and execute market sales", async () => {
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractaddress = nft.address;

    // let listingPrice = await market.getList
  })

})
