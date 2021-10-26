import { useState, ChangeEvent } from 'react';
import type { NextPage } from 'next';
import { nftaddress, nftmarketaddress } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';

// const client = ipfsHttpClient({ url: 'https://ipfs.infura.io', port: 5001, apiPath: "api/v0" });
const client = ipfsHttpClient({ url: "https://ipfs.infura.io:5001/api/v0" , });

const CreateItem: NextPage = () => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [formInput, updateFormInput] = useState({ price: "", name: "", description: "" });
    const router = useRouter();

    async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files && e.target.files[0];
        if (!file) { return }
        try {
            const added = await client.add(file, { progress: prog => { console.log(`received: ${prog}`) } })
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url);
        } catch (error) {
            console.log("Error file upload", error)
        }
    }

    async function createItem() {
        const { name, description, price } = formInput;
        if (!name || !description || !price) { return }
        const data = JSON.stringify({
            name, description, image: fileUrl,
        });

        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            createSale(url);
        } catch (error) {
            console.log('Error data upload', error);
        }

    }

    async function createSale(url: string) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
        let transaction = await contract.createToken(url);
        const tx = await transaction.wait();

        const event = tx.events[0];
        const value = event.args[2];
        const tokenId = value.toNumber();

        const price = ethers.utils.parseUnits(formInput.price, 'ether');

        contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer);
        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();
        transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice });
        await transaction.wait();
        router.push('/');

    }

    return (
        <div className='flex justify-center' >
            <div className='w-1/2 flex flex-col pb-12'>
                <input type="text" className="mt-2 border rounded p-4" placeholder='Asset Name'
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea className="mt-2 border rounded p-4" placeholder='Asset Description'
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input type="number" className="mt-2 border rounded p-4" placeholder='Asset Price in Matic'
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <input type="file" className="my-4" placeholder='Asset' onChange={handleFileUpload} />
                {fileUrl &&
                    <img src={fileUrl} alt="asset" className="rounded mt-4" width='350' />
                }

                <button onClick={createItem} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Create Digital Asset
                </button>
            </div>
        </div>
    )
}

export default CreateItem;
