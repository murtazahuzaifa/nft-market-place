import { useState, ChangeEvent, useEffect } from 'react';
import type { NextPage } from 'next';
import { nftaddress, nftmarketaddress } from '../config';
import NFT from '../../backend/artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../../backend/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { NFTMarket as NFTMarketType, NFT as NFTType } from '../../backend/generated-types';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import axios from 'axios';
import { NftTypeIntereface } from '../global-types';


const CreatorDashboard: NextPage = () => {
    const [nfts, setNfts] = useState<NftTypeIntereface[]>([]);
    const [sold, setSold] = useState<NftTypeIntereface[]>([]);
    const [loadingState, setLoadingState] = useState<"not-loaded" | "loaded">('not-loaded');


    async function loadNFTs() {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer ) as any as NFTMarketType;
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider) as any as NFTType;
        const data = await marketContract.fetchItemsCreated();

        const items = await Promise.all(data.map(async (i) => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId);
            const meta = await axios.get<{ name: string, image: string, description: string }>(tokenUri);
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            const item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                sold: i.sold,
                description: meta.data.description,
            }
            return item;
        }))
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems);
        setNfts(items);
        setLoadingState('loaded')
    }

    useEffect(() => {
        loadNFTs()
    }, [])

    if (loadingState === 'loaded' && !nfts.length) {
        return (
            <h1 className='px-20 py-10 text-3xl' >No assets owned</h1>
        )
    }

    return (
        <div>
            <div className='p-4'>
                <h2 className='text-2xl py-2'>Item Created</h2>
                <div className='grid grid-col-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                    {
                        nfts.map((nft, idx) => {
                            return <div key={idx} className="border shadow rounded-xl overflow-hidden">
                                <img src={nft.image} alt="asset" className='rounded' />
                                <div className='p-4 bg-black'>
                                    <p className='text-2xl font-bold text-white'>Price - {nft.price} Eth</p>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
            {Boolean(sold.length) && (
                <div className='px-4'>
                    <h2 className='text-2xl py-2'>Item Sold</h2>
                    <div className='grid grid-col-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                        {
                            sold.map((nft, idx) => {
                                return <div key={idx} className="border shadow rounded-xl overflow-hidden">
                                    <img src={nft.image} alt="asset" className='rounded' />
                                    <div className='p-4 bg-black'>
                                        <p className='text-2xl font-bold text-white'>Price - {nft.price} Eth</p>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default CreatorDashboard;