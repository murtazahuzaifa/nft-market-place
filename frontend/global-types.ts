export interface NftTypeIntereface {
    price: string;
    tokenId: number;
    seller: string;
    owner: string;
    image: string;
    name?: string;
    sold?: boolean;
    description: string;
}