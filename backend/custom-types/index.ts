import { BigNumber, } from "ethers";

export interface MarketItem {
    itemId: BigNumber;
    nftContract: string;
    tokenId: BigNumber;
    seller: string;
    owner: string;
    price: BigNumber;
    sold: boolean;
}