import { ethers } from "ethers";
import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import image_404 from '../images/404_page_cover.jpg'

const CollectionModal = ({ nftMarketplaceGoerli, marketplaceGoerli, nftMarketplaceMumbai, marketplaceMumbai, nftMarketplaceSepolia, marketplaceSepolia, nftMarketplaceHardhat, marketplaceHardhat, account, networkName }) => {
    const params = useParams()
    let history = useNavigate();
    const toWei = (num) => ethers.utils.parseEther(num.toString())

    const [mycollection, setMycollection] = useState({})
    const [mynfts, setMynfts] = useState([])
    const [collectionFound, setCollectionFound] = useState(false)

    const loadCollection = async () => {
        setMycollection({})
        setMynfts([])
        setCollectionFound(false)
        const response1 = await fetch(`http://127.0.0.1:5000/api/collection/fetchparticularcollection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: params.name
            })
        });
        const json1 = await response1.json()
        if (json1.success) {
            setMycollection(json1.collections)
            setCollectionFound(true)
        }
        else {
            toast.error(`${json1.error}`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        const response2 = await fetch(`http://127.0.0.1:5000/api/create/fetchnfts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                collectionName: params.name
            })
        });
        const json2 = await response2.json()
        if (json2.success) {
            setMynfts(json2.nfts)
        }
        else {
            toast.error(`${json2.error}`, {
                position: "top-right",
                autoClose: 2000,
            });
            console.log(json2.error)
            return;
        }
    }
    const addCart = async (item) => {
        if (account === null) {
            toast.error(`Connect your metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (account === item.currentSeller) {
            toast.error(`You cannot add your item`, {
                position: "top-right",
                autoClose: 2000,
            });
            return
        }
        const response1 = await fetch(`http://127.0.0.1:5000/api/cart/entercart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file: item.file,
                previewImage: item.previewImage,
                filetype: item.filetype,
                name: item.name,
                description: item.description,
                walletAddress: account,
                collectionName: item.collectionName,
                cartId: `${item.tokenId}`,
                privateState: item.privateState ? true : false,
                externalLink: item.externalLink,
                price: item.price,
                network: item.network,
                owner: item.owner,
                currentSeller: item.currentSeller,
                ready: item.ready
            })
        });
        const json1 = await response1.json()
        if (!json1.success) {
            toast.error(`${json1.error}`, {
                position: "top-right",
                autoClose: 2000,
            });
            console.log(json1.error)
            return;
        }
        else {
            toast.success(`Item is added to cart`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
    }
    const buyNFT = async (item) => {
        if (account === null) {
            toast.error(`Connect your metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        if (networkName !== item.network) {
            toast.error(`change network to ${item.network} in metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (account === item.currentSeller) {
            toast.error(`You cannot buy your own NFT`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else {
            let x = 10;
            console.log(toWei(item.price))
            if (networkName === "sepolia") {
                try {
                    await (await marketplaceSepolia.purchaseItem(nftMarketplaceSepolia.address, item.tokenId, { value: toWei(item.price * (101 / 100)) })).wait()
                    x = 11;
                }
                catch (error) {
                    console.log(error)
                    toast.error(`Transaction was cancelled`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    return;
                }
            }
            else if (networkName === "mumbai") {
                try {
                    await (await marketplaceMumbai.purchaseItem(nftMarketplaceMumbai.address, item.tokenId, { value: toWei(item.price * (101 / 100)) })).wait()
                    x = 11;
                }
                catch (error) {
                    toast.error(`Transaction was cancelled`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    console.log(error)
                    return;
                }
            }
            else if (networkName === "goerli") {
                try {
                    await (await marketplaceGoerli.purchaseItem(nftMarketplaceGoerli.address, item.tokenId, { value: toWei(item.price * (101 / 100)) })).wait()
                    x = 11;
                }
                catch (error) {
                    toast.error(`Transaction was cancelled`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    console.log(error)
                    return;
                }
            }
            else if (networkName === "hardhat") {
                try {
                    await (await marketplaceHardhat.purchaseItem(nftMarketplaceHardhat.address, item.tokenId, { value: toWei(item.price * (101 / 100)) })).wait()
                    x = 11;
                }
                catch (error) {
                    toast.error(`Transaction was cancelled`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    console.log(error)
                    return;
                }
            }
            if (x !== 10) {
                const response = await fetch(`http://127.0.0.1:5000/api/create/updatenft`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        collectionName: item.collectionName,
                        tokenId: item.tokenId,
                        network: item.network,
                        privateState: item.privateState,
                        price: item.price,
                        currentSeller: account,
                        ready: false,
                    })
                });
                const json = await response.json()
                if (json.success) {
                    const response3 = await fetch(`http://127.0.0.1:5000/api/collection/updatecollectioninfo`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: params.name
                        })
                    });
                    const json3 = await response3.json()
                    if (!json3.success) {
                        toast.error(`${json3.error}`, {
                            position: "top-right",
                            autoClose: 2000,
                        });
                        return;
                    }
                    loadCollection()
                    toast.success(`Bought NFT successfully`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    return;
                }
                else {
                    console.log(json.error)
                    toast.error(`${json.error}`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    return;
                }
            }
        }
    }

    const comeback = async () => {
        history('/')
    }
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Skip running the function on the initial render
        }
        loadCollection()
    }, [])
    return (
        <div className='my-5'>
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
            {collectionFound ? (
                <div>
                    <div style={{ border: "2px solid black", height: "20rem", marginTop: "-10px", backgroundImage: `url(${mycollection.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "100% 20rem" }}>
                        <img src={mycollection.profileImage} alt='...' style={{ transform: "translate(30%, 70%)", width: "15rem", height: "15rem", borderRadius: "20%", border: "10px solid white" }} ></img>
                    </div>
                    <div className='my-5 mx-5' style={{ float: "right" }}>
                        <i className="fa-regular fa-heart mx-4" style={{ fontSize: '1.5rem' }}></i>
                        <i className="fa-solid fa-copy mx-4" style={{ fontSize: '1.5rem' }}></i>
                        <i className="fa-sharp fa-regular fa-flag mx-4" style={{ fontSize: '1.5rem' }}></i>
                    </div><br /><br />
                    <div className='my-5'>
                        <h2 className='mx-5 mb-4'><span className='mx-5'>{mycollection.name}</span></h2>
                        <span className='mx-5'><span style={{ fontSize: "20px" }}>Chain : </span><b style={{ fontSize: "20px" }}>{mycollection.network}</b></span>
                        <span className='mx-5'><span style={{ fontSize: "20px" }}>Created : </span><b style={{ fontSize: "20px" }}>{mycollection.date}</b></span>
                        <span className='mx-5'><span style={{ fontSize: "20px" }}>Category : </span><b style={{ fontSize: "20px" }}>{mycollection.category}</b></span>
                        <h4 className='mx-5 my-3'>{mycollection.description}</h4>
                        <span className='mx-4'><span className='mx-3'><span style={{ fontSize: "20px" }}>Total volume : </span><b style={{ fontSize: "20px" }}>{mycollection.totalVolume}</b></span></span>
                        <span className='mx-3'><span style={{ fontSize: "20px" }}>Floor price : </span><b style={{ fontSize: "20px" }}>{mycollection.floorPrice}</b></span>
                        <span className='mx-3'><span style={{ fontSize: "20px" }}>Ceil price : </span><b style={{ fontSize: "20px" }}>{mycollection.ceilPrice}</b></span>
                        <span className='mx-3'><span style={{ fontSize: "20px" }}>Sold percentage : </span><b style={{ fontSize: "20px" }}>{mycollection.soldPercent}</b>%</span>
                        <span className='mx-3'><span style={{ fontSize: "20px" }}>Total items : </span><b style={{ fontSize: "20px" }}>{mycollection.totalItems}</b></span>
                        <hr className='mx-5' />
                    </div>
                    <div >
                        <div className='mx-3'>
                            <div className="dropdown mx-3" style={{ float: "left" }}>
                                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Low to High
                                </button>
                                <ul className="dropdown-menu">
                                    <Link style={{ color: "black", textDecoration: "none", textAlign: "center", fontSize: "20px" }}><li>High to Low</li></Link>
                                    <Link style={{ color: "black", textDecoration: "none", textAlign: "center", fontSize: "20px" }}><li>Low to High</li></Link>
                                    <Link style={{ color: "black", textDecoration: "none", textAlign: "center", fontSize: "20px" }}><li>Recent created</li></Link>
                                    <Link style={{ color: "black", textDecoration: "none", textAlign: "center", fontSize: "20px" }}><li>Older created</li></Link>
                                    <Link style={{ color: "black", textDecoration: "none", textAlign: "center", fontSize: "20px" }}><li>Most liked</li></Link>
                                </ul>
                            </div>
                            <input className="form-control me-1" type="search" placeholder="Search" aria-label="Search" style={{ maxWidth: "35%", textAlign: "center", float: "left" }} />
                            <button type='button' className='btn btn-outline-dark' style={{ float: "left" }}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                            <div style={{ float: "right" }}>
                                <i className="fa-brands fa-ethereum mx-2" style={{ fontSize: '1.5rem', float: "right" }}></i>
                                <b className=''>{mycollection.walletAddress}</b>
                            </div>
                        </div>
                    </div><br /><br /><br />
                    <div className='mx-5'>
                        {mynfts.length > 0 ? (
                            <div className="row">
                                {mynfts.map((item, idx) => (
                                    <div key={idx} className="col my-3" style={{ maxWidth: "fit-content" }}>
                                        <div className="overflow-hidden" style={{ width: "16rem", height: "22.5rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                            <Link to={'/' + item.collectionName + '/' + item.network + '/' + item.tokenId} >
                                                <img src={item.previewImage !== "" ? item.previewImage : item.file} alt="..." style={{ width: "16rem", height: "12rem" }} />
                                            </Link>
                                            <div className="card-body">
                                                <h3 className="card-title mx-3 my-2">{item.name}</h3>
                                                <span style={{ float: "right", color: "silver", marginTop: "-35px", marginRight: "20px" }}>({item.privateState ? `Private` : `Public`})</span>
                                                {(!item.privateState && item.owner === item.currentSeller && item.ready) &&
                                                    <div className='my-3'>
                                                        <button className="btn btn-primary mx-3 my-2" style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }} onClick={() => addCart(item)}>Add cart</button>
                                                        <button className="btn btn-primary mx-3" style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }} onClick={() => buyNFT(item)}>Buy {item.price * (101 / 100)} ETH</button>
                                                    </div>
                                                }
                                                {(item.privateState && item.owner === item.currentSeller && item.ready) &&
                                                    <div className='my-3 mx-3'>
                                                        <span>Item price : <b>{item.price}</b></span>
                                                        <button className="btn btn-primary my-4" style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }} onClick={() => addCart(item)}>Add cart</button>
                                                    </div>
                                                }
                                                {(item.owner === item.currentSeller && !item.ready) &&
                                                    <div className='my-3 mx-3'>
                                                        <h5>Not Ready for sale</h5>
                                                        <button className="btn btn-primary my-4" style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }} onClick={() => addCart(item)}>Add cart</button>
                                                    </div>
                                                }
                                                {item.owner !== item.currentSeller &&
                                                    <div className='my-3 mx-3'>
                                                        <h5>Item solded for <b>{item.price}</b> ETH</h5>
                                                        <Link to={'/' + item.collectionName + '/' + item.network + '/' + item.tokenId} >
                                                            <button className="btn btn-primary my-4" style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }}>View Details</button>
                                                        </Link>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "16rem", height: "21rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%", textAlign: "center" }}><h2 style={{ marginTop: "9rem" }}>NULL</h2>
                            </div>
                        )}
                    </div><br /><br /><br /><br /><br />
                </div>
            ) : (
                <div style={{ backgroundImage: `url(${image_404})`, backgroundRepeat: "no-repeat", textAlign: "center", height: "40rem", backgroundSize: "100% 40rem", }}>
                    <button className='btn btn-outline-dark' style={{ marginTop: "2rem" }} onClick={comeback}>Home</button>
                </div>
            )}
        </div>
    )
}

export default CollectionModal