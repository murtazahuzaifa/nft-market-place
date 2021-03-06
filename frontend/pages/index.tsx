import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { nftaddress, nftmarketaddress } from '../config';
import NFT from '../../backend/artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../../backend/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { NFTMarket as NFTMarketType, NFT as NFTType } from '../../backend/generated-types';
import { NftTypeIntereface } from '../global-types';
import axios from 'axios';
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<NftTypeIntereface[]>([]);
  const [loadingState, setLoadingState] = useState<"not-loaded" | "loaded">('not-loaded');

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider();
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, provider) as any as NFTMarketType;
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider) as any as NFTType;
    const data = await marketContract.fetchMarketItems();

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
        name: meta.data.name,
        description: meta.data.description,
      }
      return item;
    }))
    setNfts(items);
    setLoadingState('loaded')
  }

  async function buyNft(nft: NftTypeIntereface) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer) as any as NFTMarketType;
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, { value: price });
    await transaction.wait();
    loadNFTs();
  }

  useEffect(() => {
    loadNFTs()
  }, [])

  if (loadingState === 'loaded' && !nfts.length) {
    return (
      <h1 className='px-20 py-10 text-3xl' >No items in marketplace</h1>
    )
  }

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{ maxWidth: "1280px" }} >
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            nfts.map((nft, idx) => {
              return <div key={idx} className='border shodow rounded-xl overflow-hidden'>
                <img src={nft.image} />
                <div className='p-4'>
                  <p style={{ height: '64px' }} className='text-2xl font-semibold'>{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p style={{ height: '64px' }} className='text-2xl font-semibold'>{nft.description}</p>
                  </div>
                </div>
                <div className='p-4 bg-black'>
                  <p className='text-2xl mb-4 font-bold text-white'>{nft.price}</p>
                  <button className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded' onClick={() => buyNft(nft)} >
                    Buy
                  </button>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Home
