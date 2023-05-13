import React, { useState, useContext } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Buffer } from 'buffer'
import { ethers } from "ethers"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NftContext from '../context/NftContext';

const projectId = '2N7yp4DUu80pxg5dnzC9t0Pj9dM';
const projectSecret = '38a1af53c42ef43d40476b8f5083db44';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

const CreateNft = ({ nftMarketplaceGoerli, marketplaceGoerli, nftMarketplaceMumbai, marketplaceMumbai, nftMarketplaceSepolia, marketplaceSepolia, nftMarketplaceHardhat, marketplaceHardhat, nftAuctionGoerli, auctionGoerli, nftAuctionMumbai, auctionMumbai, nftAuctionSepolia, auctionSepolia, nftAuctionHardhat, auctionHardhat, account, networkName }) => {

    const context = useContext(NftContext);
    const { updatecollectioninfo } = context;

    const [option, setOption] = useState('')
    const [confirmButton, setConfirmButton] = useState(false)
    const [videoOrNot, setVideoOrNot] = useState('')
    const [displayOrNot, setdisplayOrNot] = useState('none')
    const [imageLoading, setImageLoading] = useState(false)
    const [previewImageLoading, setPreviewImageLoading] = useState(false)
    const [previewMarketplace, setPreviewMarketplace] = useState(false)
    const [previewAuction, setPreviewAuction] = useState(false)

    // storing nft data
    const [image, setImage] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [externallink, setExternallink] = useState('')
    const [particulatCollection, setParticulatCollection] = useState('')
    const [category, setCategory] = useState('null')
    const [network, setNetwork] = useState('')
    const [collectionNetwork, setCollectionNetwork] = useState('')
    const [state, setState] = useState('')
    const [price, setPrice] = useState('')
    const [collections, setCollections] = useState([])

    const setConfirmation = async () => {
        setConfirmButton(true)
        await getAllCollections()
    }
    const comeBackButton = () => {
        setConfirmButton(false)
        setOption('')
        setImage('')
        setPreviewImage('')
        setName('')
        setDescription('')
        setExternallink('')
        setParticulatCollection('')
        setCategory('')
        setNetwork('')
        setCollectionNetwork('')
        setState('')
        setPrice('')
        setCollections([])
        setVideoOrNot('')
        setdisplayOrNot('none')
        setImageLoading(false)
        setPreviewImageLoading(false)
        setPreviewMarketplace(false)
    }
    const getAllCollections = async () => {
        const response = await fetch(`http://127.0.0.1:5000/api/collection/fetchcollections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                walletAddress: account
            })
        });
        const json = await response.json()
        if (json.success) {
            setCollections(json.collections)
            fetchParticularCollection()
        }
    }
    const fetchParticularCollection = async () => {
        setParticulatCollection('')
        setCategory('null')
        setCollectionNetwork('')
        if (collections.length !== 0) {
            const response = await fetch(`http://127.0.0.1:5000/api/collection/fetchparticularcollection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    walletAddress: account,
                    name: particulatCollection
                })
            });
            const json = await response.json()
            if (json.success) {
                setParticulatCollection(json.collections.name)
                setCategory(json.collections.category)
                setCollectionNetwork(json.collections.network)
            }
            return;
        }
    }
    const profileToIPFS = async (file) => {
        setImageLoading(true)
        setImage('')
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file)
                setImage(`https://ipfs.io/ipfs/${result.path}`)
            } catch (error) {
                console.log("ipfs image upload error: ", error)
            }
        }
        setImageLoading(false)
    }
    const previewImageToIPFS = async (event) => {
        setPreviewImageLoading(true)
        setPreviewImage('')
        event.preventDefault()
        const file = event.target.files[0]
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file)
                setPreviewImage(`https://ipfs.io/ipfs/${result.path}`)
            } catch (error) {
                console.log("ipfs image upload error: ", error)
            }
        }
        setPreviewImageLoading(false)
    }
    const handleFileSelection = async (event) => {
        setdisplayOrNot('none')
        setVideoOrNot('image')
        const file = await event.target.files[0]
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2)
        console.log(fileSizeInMB)
        if (fileSizeInMB >= 10) {
            toast.error('file size must be less than 10MB', {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        await profileToIPFS(file)
        if (file.type === "video/mp4") {
            setVideoOrNot('video');
            setdisplayOrNot('')
            return;
        }
        else if (file.type === "audio/mpeg") {
            setVideoOrNot('audio');
            setdisplayOrNot('')
            return;
        }
        else if (file.type === "application/pdf" || file.type === "text/plain") {
            setVideoOrNot('pdf');
            setdisplayOrNot('')
            return;
        }
    }
    const marketplacePreview = async () => {
        setPreviewMarketplace(false)
        console.log(collectionNetwork)
        console.log(network)
        if (image === "" || name === "" || description === "" || network === "" || price === "" || state === "" || particulatCollection === "") {
            toast.error(`Fill all required fields`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (price <= 0) {
            toast.error(`Price must be greater than ZERO`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (collectionNetwork !== network) {
            toast.error(`Network not matches with collection network type`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (networkName !== network) {
            toast.error(`Change network to ${network} in metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (videoOrNot === "video" || videoOrNot === "audio" || videoOrNot === "pdf") {
            if (previewImage === "") {
                toast.error(`Select a preview image`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                return;
            }
            else {
                setPreviewMarketplace(true)
                try {
                    document.getElementById('previewButton').click()
                } catch (error) {
                    console.log(error)
                }
            }
        }
        else {
            setPreviewMarketplace(true)
            try {
                document.getElementById('previewButton').click()
            } catch (error) {
                console.log(error)
            }
        }
    }
    const auctionPreview = async () => {
        setPreviewAuction(false)
        if (image === "" || name === "" || description === "" || network === "" || price === "") {
            toast.error(`Fill all required fields`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (price <= 0) {
            toast.error(`Price must be greater than ZERO`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (networkName !== network) {
            toast.error(`Change network to ${network} in metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (videoOrNot === "video" || videoOrNot === "audio" || videoOrNot === "pdf") {
            if (previewImage === "") {
                toast.error(`Select a preview image`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                return;
            }
            else {
                setPreviewAuction(true)
                try {
                    document.getElementById('previewButtonAuction').click()
                } catch (error) {
                    console.log(error)
                }
            }
        }
        else {
            setPreviewAuction(true)
            try {
                document.getElementById('previewButtonAuction').click()
            } catch (error) {
                console.log(error)
            }
        }
    }
    const createNFT = async () => {
        // previewMarketplace(false)
        if (videoOrNot === "image") {
            try {
                const result = await client.add(JSON.stringify({ name, description, image }))
                mintThenList(result)
                console.log(result)
            } catch (error) {
                console.log("create uri upload error: ", error)
                toast.error(`Unable to upload metadata to IPFS!`, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }
        else {
            try {
                const result = await client.add(JSON.stringify({ name, description, image, previewImage }))
                console.log(result)
                mintThenList(result)
            } catch (error) {
                console.log("create uri upload error: ", error)
                toast.error(`Unable to upload metadata to IPFS!`, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }
    }
    const mintThenList = async (result) => {
        const uri = `https://ipfs.io/ipfs/${result.path}`
        console.log(uri);
        let stateBool;
        if (state === "private") {
            stateBool = true;
        }
        else if (state === "public") {
            stateBool = false
        }
        // mint nft 
        let x = 10;
        let id;
        if (networkName === "mumbai") {
            try {
                await (await nftMarketplaceMumbai.mint(uri)).wait()
                id = await nftMarketplaceMumbai.tokenCount()
                await (await nftMarketplaceMumbai.setApprovalForAll(marketplaceMumbai.address, true)).wait()
                const listingPrice = ethers.utils.parseEther(price.toString())
                await (await marketplaceMumbai.makeItem(nftMarketplaceMumbai.address, id, stateBool, listingPrice)).wait()
                x = 11;
            }
            catch {
                toast.error('Transction was cancelled MUMBAI!', {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }
        else if (networkName === "sepolia") {
            try {
                await (await nftMarketplaceSepolia.mint(uri)).wait()
                id = await nftMarketplaceSepolia.tokenCount()
                await (await nftMarketplaceSepolia.setApprovalForAll(marketplaceSepolia.address, true)).wait()
                const listingPrice = ethers.utils.parseEther(price.toString())
                await (await marketplaceSepolia.makeItem(nftMarketplaceSepolia.address, id, stateBool, listingPrice)).wait()
                x = 11;
            }
            catch {
                toast.error('Transction was cancelled SEPOLIA!', {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }
        else if (networkName === "goerli") {
            try {
                await (await nftMarketplaceGoerli.mint(uri)).wait()
                id = await nftMarketplaceGoerli.tokenCount()
                await (await nftMarketplaceGoerli.setApprovalForAll(marketplaceGoerli.address, true)).wait()
                const listingPrice = ethers.utils.parseEther(price.toString())
                await (await marketplaceGoerli.makeItem(nftMarketplaceGoerli.address, id, stateBool, listingPrice)).wait()
                x = 11;
            }
            catch {
                toast.error('Transction was cancelled GOERLI!', {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }
        else if (networkName === "hardhat") {
            try {
                await (await nftMarketplaceHardhat.mint(uri)).wait()
                id = await nftMarketplaceHardhat.tokenCount()
                await (await nftMarketplaceHardhat.setApprovalForAll(marketplaceHardhat.address, true)).wait()
                const listingPrice = ethers.utils.parseEther(price.toString())
                await (await marketplaceHardhat.makeItem(nftMarketplaceHardhat.address, id, stateBool, listingPrice)).wait()
                x = 11;
            }
            catch {
                toast.error('Transction was cancelled HARDHAT!', {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }
        if (x === 11) {
            if (externallink === "") {
                setExternallink("null")
            }
            console.log(typeof (id))
            console.log(id)
            const response = await fetch(`http://127.0.0.1:5000/api/create/createnft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    file: image,
                    previewImage: previewImage,
                    filetype: videoOrNot,
                    name: name,
                    description: description,
                    collectionName: particulatCollection,
                    tokenId: id.toString(),
                    privateState: stateBool,
                    externalLink: externallink,
                    price: price,
                    network: network,
                    category: category,
                    owner: account,
                    currentSeller: account,
                    ready: true
                })
            });
            const json = await response.json()
            if (json.success) {
                await updatecollectioninfo(account, particulatCollection)
                setImage('')
                setPreviewImage('')
                setName('')
                setDescription('')
                setExternallink('')
                setParticulatCollection('')
                setCategory('')
                setNetwork('')
                setCollectionNetwork('')
                setState('')
                setPrice('')
                setCollections([])
                setOption('')
                setConfirmButton(false)
                setVideoOrNot('')
                setdisplayOrNot('none')
                setImageLoading(false)
                setPreviewImageLoading(false)
                setPreviewMarketplace(false)
                toast.success(`NFT is successfully minted on ${networkName} Network`, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
            else {
                toast.error(`${json.error}`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                console.log(json.error)
                return;
            }
        }
    }
    const createNFTAuction = async () => {
        // previewMarketplace(false)
        if (videoOrNot === "image") {
            try {
                const result = await client.add(JSON.stringify({ name, description, image }))
                mintThenListAuction(result)
                console.log(result)
            } catch (error) {
                console.log("create uri upload error: ", error)
                toast.error(`Unable to upload metadata to IPFS!`, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }
        else {
            try {
                const result = await client.add(JSON.stringify({ name, description, image, previewImage }))
                console.log(result)
                mintThenListAuction(result)
            } catch (error) {
                console.log("create uri upload error: ", error)
                toast.error(`Unable to upload metadata to IPFS!`, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }
    }
    const mintThenListAuction = async (result) => {
        const uri = `https://ipfs.io/ipfs/${result.path}`
        console.log(uri);
        // mint nft 
        let y = 10;
        let id;
        if (networkName === "mumbai") {
            try {
                await (await nftAuctionMumbai.mint(uri)).wait()
                id = await nftAuctionMumbai.tokenCount()
                await (await nftAuctionMumbai.setApprovalForAll(auctionMumbai.address, true)).wait()
                const listingPrice = ethers.utils.parseEther(price.toString())
                await (await auctionMumbai.enterAuction(nftAuctionMumbai.address, id, listingPrice)).wait()
                y = 11;
            }
            catch (error) {
                toast.error('Transction was cancelled MUMBAI!', {
                    position: "top-right",
                    autoClose: 2000,
                });
                console.log(error)
            }
        }
        else if (networkName === "sepolia") {
            try {
                await (await nftAuctionSepolia.mint(uri)).wait()
                id = await nftAuctionSepolia.tokenCount()
                await (await nftAuctionSepolia.setApprovalForAll(auctionSepolia.address, true)).wait()
                const listingPrice = ethers.utils.parseEther(price.toString())
                await (await auctionSepolia.enterAuction(nftAuctionSepolia.address, id, listingPrice)).wait()
                y = 11;
            }
            catch (error) {
                toast.error('Transction was cancelled SEPOLIA!', {
                    position: "top-right",
                    autoClose: 2000,
                });
                console.log(error)
            }
        }
        else if (networkName === "goerli") {
            try {
                await (await nftAuctionGoerli.mint(uri)).wait()
                id = await nftAuctionGoerli.tokenCount()
                await (await nftAuctionGoerli.setApprovalForAll(auctionGoerli.address, true)).wait()
                const listingPrice = ethers.utils.parseEther(price.toString())
                await (await auctionGoerli.enterAuction(nftAuctionGoerli.address, id, listingPrice)).wait()
                y = 11;
            }
            catch (error) {
                toast.error('Transction was cancelled GOERLI!', {
                    position: "top-right",
                    autoClose: 2000,
                });
                console.log(error)
            }
        }
        else if (networkName === "hardhat") {
            try {
                await (await nftAuctionHardhat.mint(uri)).wait()
                id = await nftAuctionHardhat.tokenCount()
                await (await nftAuctionHardhat.setApprovalForAll(auctionHardhat.address, true)).wait()
                const listingPrice = ethers.utils.parseEther(price.toString())
                await (await auctionHardhat.enterAuction(nftAuctionHardhat.address, id, listingPrice)).wait()
                y = 11;
            }
            catch (error) {
                toast.error('Transction was cancelled HARDHAT!', {
                    position: "top-right",
                    autoClose: 2000,
                });
                console.log(error)
            }
        }
        if (y === 11) {
            if (externallink === '') {
                setExternallink("Null")
            }
            const response = await fetch(`http://127.0.0.1:5000/api/auction/enterauction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    file: image,
                    previewImage: previewImage,
                    filetype: videoOrNot,
                    name: name,
                    description: description,
                    tokenId: `${id}`,
                    externalLink: externallink,
                    basePrice: price,
                    network: network,
                    owner: account,
                    winner: "Null",
                    highestAmount: 0,
                    atAuction: true
                })
            });
            const json = await response.json()
            console.log(json)
            if (json.success) {
                setImage('')
                setPreviewImage('')
                setName('')
                setDescription('')
                setExternallink('')
                setNetwork('')
                setPrice('')
                setOption('')
                setConfirmButton(false)
                setVideoOrNot('')
                setdisplayOrNot('none')
                setImageLoading(false)
                setPreviewImageLoading(false)
                setPreviewAuction(false)
                toast.success(`Item is ready for auction on ${networkName} Network`, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
            else {
                toast.error(`${json.error}`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                console.log(json.error)
                return;
            }
        }
    }
    window.ethereum.on('chainChanged', async (chainId) => {
        window.location.reload()
    })

    return (
        <div className='container my-5'>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {(confirmButton && option === "option1" && previewMarketplace) &&
                <div>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop1" id="previewButton" style={{ display: "none" }}>
                        Launch static backdrop modal
                    </button>
                    <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered ">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel"><strong>Preview NFT</strong></h1>
                                </div>
                                <div className="modal-dialog ">
                                    <div className="card" style={{ width: "18rem" }}>
                                        <img src={videoOrNot === "image" ? image : previewImage} className="card-img-top" alt="..." width="18rem" height="300rem" />
                                        <div className="card-body">
                                            <h5 className="card-title">{name}</h5>
                                            <button className="btn btn-primary my-2" style={{ width: "100%" }}>Add cart</button><br />
                                            <button className="btn btn-primary" style={{ width: "100%" }}>Buy {price * (100 + 1) / 100}</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer" >
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Edit</button>
                                    <button type="button" onClick={createNFT} data-bs-dismiss="modal" className="btn btn-primary">Mint NFT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {(confirmButton && option === "option2" && previewAuction) &&
                <div>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop1" id="previewButtonAuction" style={{ display: "none" }}>
                        Launch static backdrop modal
                    </button>
                    <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered ">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel"><strong>Preview NFT</strong></h1>
                                </div>
                                <div className="modal-dialog ">
                                    <div className="card" style={{ width: "18rem" }}>
                                        <img src={videoOrNot === "image" ? image : previewImage} className="card-img-top" alt="..." width="18rem" height="300rem" />
                                        <div className="card-body">
                                            <h3 className="card-title">{name}</h3>
                                            <p>Base price is {price} ETH <span style={{ color: "silver" }}>({network})</span><span style={{ color: "red" }}>*</span></p>
                                            <input type="number" className='my-2' style={{ width: "100%", textAlign: "center" }} placeholder='Enter bid price in ETH'></input>
                                            <button className="btn btn-primary" style={{ width: "100%" }}>Bid Item</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer" >
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Edit</button>
                                    <button type="button" onClick={createNFTAuction} data-bs-dismiss="modal" className="btn btn-primary">Mint NFT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {(confirmButton && option === "option1") &&
                <div className='my-5'>
                    <button type="button" className="btn btn-outline-dark" onClick={comeBackButton} style={{ float: "left" }}>Back</button>
                    <h2 style={{ textAlign: "center" }}>Mint for Marketplace</h2>

                    <div className='my-5  mx-5' style={{ float: "left" }}>
                        <b>Select file</b><span style={{ color: "red" }}>*</span><span className='mx-5' style={{ color: "silver" }}>Max size: 10 MB</span><br /><br />
                        <div style={{ width: "17rem", height: "22rem", border: "1px dashed black", boxShadow: "-16px 15px 6px silver", borderRadius: "5%" }}>
                            {videoOrNot === "image" &&
                                <img src={image} alt={imageLoading ? `Uploading to IPFS` : `NFT Image`} style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%" }} />
                            }
                            {videoOrNot === "video" &&
                                <video src={image} alt={imageLoading ? `Uploading to IPFS` : `NFT Image`} type="video/mp4" style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%" }} controls>
                                </video>
                            }
                            {videoOrNot === "audio" &&
                                <audio controls style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%" }} src={image} type="audio/mpeg" alt={imageLoading ? `Uploading to IPFS` : `NFT Image`}>
                                </audio>
                            }
                            {videoOrNot === "pdf" &&
                                <iframe src={image} alt={imageLoading ? `Uploading to IPFS` : `NFT Image`} style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%" }} title="Your IPFS Book"></iframe>
                            }
                        </div><br />
                        <input type='file' accept='.png, .jpg, .jpeg, .pdf, .txt, .mp3, .mp4' onChange={handleFileSelection}></input><br /><br /><br /><br />

                        <div >
                            <b style={{ display: `${displayOrNot}` }}>Preview Image</b><span style={{ color: "red", display: `${displayOrNot}` }}>*</span><br /><br />
                            <div style={{ width: "17rem", height: "22rem", border: "1px dashed black", boxShadow: "-16px 15px 6px silver", borderRadius: "5%", display: `${displayOrNot}` }}>
                                <img src={previewImage} alt={previewImageLoading ? `Uploading to IPFS` : `NFT preview Image`} style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%", display: `${displayOrNot}` }} />
                            </div><br />
                            <input type='file' accept='.png, .jpg, .jpeg' onChange={previewImageToIPFS} style={{ display: `${displayOrNot}` }}></input>
                        </div>
                    </div>
                    <div className='container col-lg-12 mx-auto my-5' style={{ maxWidth: "700px", float: "right" }} >
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label"><b>NFT Name<span style={{ color: "red" }}>*</span></b></label>
                            <p>The name will display on your NFT item</p>
                            <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} id="name" placeholder="NFT Name" />
                        </div><br />

                        <div className="mb-3">
                            <label htmlFor="desc" className="form-label"><b>NFT Description<span style={{ color: "red" }}>*</span></b></label>
                            <p>The description will be included on the item's detail page underneath its image. Markdown syntax is supported.</p>
                            <textarea className="form-control" id="desc" onChange={(e) => setDescription(e.target.value)} rows="5" placeholder="Provide a detailed description about your item"></textarea>
                        </div><br />

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label"><b>External link</b></label>
                            <p>Marketplace will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.</p>
                            <input type="text" className="form-control" onChange={(e) => setExternallink(e.target.value)} id="name" placeholder="External link" />
                        </div><br />

                        <b>Select Collection<span style={{ color: "red" }}>*</span></b>
                        <p>This is the collection where your item will appear.</p>
                        <select className="form-select form-select mb-3" onChange={(e) => setParticulatCollection(e.target.value)} onClick={getAllCollections} aria-label=".form-select-lg example">
                            <option value="" style={{ backgroundColor: "lightskyblue" }}>select collection</option>
                            {collections.map((item, idx) => (
                                <option value={item.name} key={idx} onClick={fetchParticularCollection}>{item.name}</option>
                            ))}
                        </select>
                        <div>
                            <p style={{ textAlign: "center", color: "silver" }}>Your selected collection category is <i style={{ color: "black" }}>{category}</i></p>
                        </div><br />

                        <b>Select Network<span style={{ color: "red" }}>*</span></b>
                        <p>Your selected network should be match with your collection network type</p>
                        <select className="form-select form-select mb-3" onChange={(e) => setNetwork(e.target.value)} aria-label=".form-select-lg example">
                            <option value="" style={{ backgroundColor: "lightskyblue" }}>select Network</option>
                            <option value="goerli">Goerli</option>
                            <option value="sepolia">Sepolia</option>
                            <option value="mumbai">Mumbai</option>
                            <option value="hardhat">Hardhat</option>
                        </select><br />

                        <b>Select State<span style={{ color: "red" }}>*</span></b>
                        <p>State indicates the visibility of your NFT. Further can change the visibility.</p>
                        <div style={{ textAlign: "center" }}>
                            <input type="radio" name="flexRadioDefault" value="public" onChange={(e) => setState(e.target.value)} /> PUBLIC
                            <span className='mx-5'>
                                <input type="radio" name="flexRadioDefault" value="private" onChange={(e) => setState(e.target.value)} /> PRIVATE
                            </span>
                        </div><br />

                        <div className="mb-3">
                            <b>Price</b><span style={{ color: "red" }}>*</span><br />
                            <label htmlFor="name" className="form-label">Initially fix a price for your NFT in Ethers, you can change the price later also.</label>
                            <input type="number" className="form-control" onChange={(e) => setPrice(e.target.value)} id="name" placeholder="NFT Price" />
                        </div><br />

                        <div style={{ textAlign: "center" }}>
                            <button type="button" className="btn btn-primary mx-auto" onClick={marketplacePreview} style={{ width: "300px" }}>Preview mint</button>
                        </div>
                    </div>
                </div>
            }
            {
                (confirmButton && option === "option2") &&
                <div className='my-5'>
                    <button type="button" className="btn btn-outline-dark" onClick={comeBackButton} style={{ float: "left" }}>Back</button>
                    <h2 style={{ textAlign: "center" }}>Mint for Auction</h2>

                    <div className='my-5  mx-5' style={{ float: "left" }}>
                        <b>Select file</b><span style={{ color: "red" }}>*</span><span className='mx-4' style={{ color: "silver" }}>Max size: 10 MB</span><br /><br />
                        <div style={{ width: "17rem", height: "22rem", border: "1px dashed black", boxShadow: "-16px 15px 6px silver", borderRadius: "5%" }}>
                            {videoOrNot === "image" &&
                                <img src={image} alt={imageLoading ? `Uploading to IPFS` : `NFT Image`} style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%" }} />
                            }
                            {videoOrNot === "video" &&
                                <video src={image} alt={imageLoading ? `Uploading to IPFS` : `NFT Image`} type="video/mp4" style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%" }} controls>
                                </video>
                            }
                            {videoOrNot === "audio" &&
                                <audio controls style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%" }} src={image} type="audio/mpeg" alt={imageLoading ? `Uploading to IPFS` : `NFT Image`}>
                                </audio>
                            }
                            {videoOrNot === "pdf" &&
                                <iframe src={image} alt={imageLoading ? `Uploading to IPFS` : `NFT Image`} style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%" }} title="Your IPFS Book"></iframe>
                            }
                        </div><br />
                        <input type='file' accept='.png, .jpg, .jpeg, .pdf, .txt, .mp3, .mp4' onChange={handleFileSelection}></input><br /><br /><br /><br />

                        <div >
                            <b style={{ display: `${displayOrNot}` }}>Preview Image</b><span style={{ color: "red", display: `${displayOrNot}` }}>*</span><br /><br />
                            <div style={{ width: "17rem", height: "22rem", border: "1px dashed black", boxShadow: "-16px 15px 6px silver", borderRadius: "5%", display: `${displayOrNot}` }}>
                                <img src={previewImage} alt={previewImageLoading ? `Uploading to IPFS` : `NFT preview Image`} style={{ width: "16.9rem", height: "21.9rem", borderRadius: "5%", display: `${displayOrNot}` }} />
                            </div><br />
                            <input type='file' accept='.png, .jpg, .jpeg' onChange={previewImageToIPFS} style={{ display: `${displayOrNot}` }}></input>
                        </div>
                    </div>
                    <div className='container col-lg-12 mx-auto my-5' style={{ maxWidth: "700px", float: "right" }} >
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label"><b>NFT Name<span style={{ color: "red" }}>*</span></b></label>
                            <p>The name will display on your NFT item</p>
                            <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} id="name" placeholder="NFT Name" />
                        </div><br />

                        <div className="mb-3">
                            <label htmlFor="desc" className="form-label"><b>NFT Description<span style={{ color: "red" }}>*</span></b></label>
                            <p>The description will be included on the item's detail page underneath its image. Markdown syntax is supported.</p>
                            <textarea className="form-control" id="desc" onChange={(e) => setDescription(e.target.value)} rows="5" placeholder="Provide a detailed description about your item"></textarea>
                        </div><br />

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label"><b>External link</b></label>
                            <p>Marketplace will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.</p>
                            <input type="text" className="form-control" onChange={(e) => setExternallink(e.target.value)} id="name" placeholder="External link" />
                        </div><br />

                        <b>Select Network<span style={{ color: "red" }}>*</span></b>
                        <p>Your auction item is bidded on this particular network only.</p>
                        <select className="form-select form-select mb-3" onChange={(e) => setNetwork(e.target.value)} aria-label=".form-select-lg example">
                            <option value="" style={{ backgroundColor: "lightskyblue" }}>select Network</option>
                            <option value="goerli">Goerli</option>
                            <option value="sepolia">Sepolia</option>
                            <option value="mumbai">Mumbai</option>
                            <option value="hardhat">Hardhat</option>
                        </select><br />

                        <div className="mb-3">
                            <b>Price</b><span style={{ color: "red" }}>*</span><br />
                            <label htmlFor="name" className="form-label">Price will be fixed for enteire auction.</label>
                            <input type="number" className="form-control" onChange={(e) => setPrice(e.target.value)} id="name" placeholder="NFT Price" />
                        </div><br />

                        <div style={{ textAlign: "center" }}>
                            <button type="button" className="btn btn-primary mx-auto" onClick={auctionPreview} style={{ width: "300px" }}>Preview mint</button>
                        </div>
                    </div>
                </div>
            }
            {
                !confirmButton &&
                <div className='my-5' style={{ textAlign: "center" }}>
                    <button type="button" className="btn btn-outline-primary my-5" data-bs-toggle="modal" data-bs-target="#staticBackdrop1">
                        Mint NFT
                    </button>
                    <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Select the type</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-check mx-5" style={{ fontSize: "30px" }}>
                                        <input className="form-check-input" name="flexRadioDefault" type="radio" value="option1" id="flexRadioDefault1" onChange={(e) => setOption(e.target.value)} />
                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                            Mint for Marketplace
                                        </label>
                                    </div>
                                    <div className="form-check mx-5" style={{ fontSize: "30px" }}>
                                        <input className="form-check-input" name="flexRadioDefault" type="radio" value="option2" id="flexRadioDefault2" onChange={(e) => setOption(e.target.value)} />
                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                            Mint for Auction
                                        </label>
                                    </div><hr />
                                    <p><strong>Note </strong>: Connect metamask before selecting option</p>
                                </div>
                                <div className="modal-footer" style={{ display: "flex" }}>
                                    <button type="button" className="btn btn-primary" disabled={account === null || option === ''} onClick={setConfirmation} data-bs-dismiss="modal">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default CreateNft