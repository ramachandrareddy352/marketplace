import React, { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Auctions = ({ nftAuctionGoerli, auctionGoerli, nftAuctionMumbai, auctionMumbai, nftAuctionSepolia, auctionSepolia, nftAuctionHardhat, auctionHardhat, account, networkName }) => {
    const [unsoldedItems, setUnsoldedItems] = useState([])
    const [soldedItems, setSoldedItems] = useState([])
    const [bidprice, setBidprice] = useState('')
    const toWei = (num) => ethers.utils.parseEther(num.toString())
    const loadAuctionItems = async () => {
        const response1 = await fetch(`http://127.0.0.1:5000/api/auction/fetchsoldedauctionitem`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json1 = await response1.json()
        if (json1.success) {
            setSoldedItems(json1.nft)
        }
        else {
            toast.error(`${json1.error}`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        const response2 = await fetch(`http://127.0.0.1:5000/api/auction/fetchunsoldedauctionitem`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json2 = await response2.json()
        if (json2.success) {
            setUnsoldedItems(json2.nft)
        }
        else {
            toast.error(`${json2.error}`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
    }
    const bidTheItem = async (item) => {
        if (networkName !== item.network) {
            toast.error(`change network to ${item.network} in metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        if (account !== null) {
            const response = await fetch(`http://127.0.0.1:5000/api/bid/biddedornot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    participateAddress: account,
                    tokenId: item.tokenId,
                    network: networkName
                })
            });
            const json = await response.json()
            if (!json.success) {
                toast.error(`${json.error}`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                return;
            }
        }
        if (account === null) {
            toast.error(`Connect your metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (account === item.owner) {
            toast.error(`You cannot bid your own NFT`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (bidprice === "") {
            toast.error(`Enter Bid amount`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (bidprice <= item.basePrice) {
            toast.error(`Bid price must be greater than baseprice`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else if (networkName !== item.network) {
            toast.error(`change network to ${item.network} in metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        else {
            let x = 10;
            if (networkName === "sepolia") {
                try {
                    console.log(await auctionSepolia.auctionItems(5))
                    await (await auctionSepolia.bidNFT(item.tokenId, { value: toWei(bidprice) })).wait()
                    x = 11;
                }
                catch (error) {
                    console.log(error)
                    toast.error(`Bidding was cancelled`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    return;
                }
            }
            else if (networkName === "mumbai") {
                try {
                    await (await auctionMumbai.bidNFT(item.tokenId, { value: toWei(bidprice) })).wait()
                    x = 11;
                }
                catch (error) {
                    toast.error(`Bidding was cancelled`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    console.log(error)
                    return;
                }
            }
            else if (networkName === "goerli") {
                try {
                    await (await auctionGoerli.bidNFT(item.tokenId, { value: toWei(bidprice) })).wait()
                    x = 11;
                }
                catch (error) {
                    toast.error(`Bidding was cancelled`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    console.log(error)
                    return;
                }
            }
            else if (networkName === "hardhat") {
                try {
                    await (await auctionHardhat.bidNFT(item.tokenId, { value: toWei(bidprice) })).wait()
                    x = 11;
                }
                catch (error) {
                    toast.error(`Bidding was cancelled`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    console.log(error)
                    return;
                }
            }
            if (x !== 10) {
                const response = await fetch(`http://127.0.0.1:5000/api/bid/bidnft`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        participateAddress: account,
                        tokenId: item.tokenId,
                        network: networkName,
                        biddingPrice: bidprice
                    })
                });
                const json = await response.json()
                if (json.success) {
                    toast.success(`Bided successfully`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    setBidprice('')
                    return;
                }
                else {
                    toast.error(`${json.error}`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    return;
                }
            }
        }
    }
    const announceItemWinner = async (item) => {
        let x = 10;
        let winnerAddress;
        let highestAmountBidded;
        if (networkName !== item.network) {
            toast.error(`change network to ${item.network} in metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        const response = await fetch(`http://127.0.0.1:5000/api/bid/fetchbiditem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tokenId: item.tokenId,
                network: networkName
            })
        });
        const json = await response.json() //nfts
        if (!json.success) {
            toast.error(`${json.error}`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        if (json.nfts.length < 2) {
            toast.error(`Less than two participates`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        if (networkName === "sepolia") {
            try {
                await (await auctionSepolia.announceWinner(nftAuctionSepolia.address, item.tokenId)).wait()
                const resp = await auctionSepolia.winningItems(item.tokenId)
                winnerAddress = `${resp.winnerAddress}`;
                highestAmountBidded = `${resp.winningPrice}`;
                x = 11;
            }
            catch (error) {
                console.log(error)
                toast.error(`Bidding was cancelled`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                return;
            }
        }
        else if (networkName === "mumbai") {
            try {
                await (await auctionMumbai.announceWinner(nftAuctionMumbai.address, item.tokenId)).wait()
                const resp = await auctionMumbai.winningItems(item.tokenId)
                winnerAddress = `${resp.winnerAddress}`;
                highestAmountBidded = `${resp.winningPrice}`;
                x = 11;
            }
            catch (error) {
                toast.error(`Bidding was cancelled`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                console.log(error)
                return;
            }
        }
        else if (networkName === "goerli") {
            try {
                await (await auctionGoerli.announceWinner(nftAuctionGoerli.address, item.tokenId)).wait()
                const resp = await auctionGoerli.winningItems(item.tokenId)
                winnerAddress = `${resp.winnerAddress}`;
                highestAmountBidded = `${resp.winningPrice}`;
                x = 11;
            }
            catch (error) {
                toast.error(`Bidding was cancelled`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                console.log(error)
                return;
            }
        }
        else if (networkName === "hardhat") {
            try {
                await (await auctionHardhat.announceWinner(nftAuctionHardhat.address, item.tokenId)).wait()
                const resp = await auctionHardhat.winningItems(item.tokenId)
                winnerAddress = `${resp.winnerAddress}`;
                highestAmountBidded = `${resp.winningPrice}`;
                x = 11;
            }
            catch (error) {
                toast.error(`Bidding was cancelled`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                console.log(error)
                return;
            }
        }
        if (x !== 10) {
            const finalAmount = ethers.utils.parseEther(highestAmountBidded.toString())
            const response = await fetch(`http://127.0.0.1:5000/api/auction/updateauctionnft`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    network: networkName,
                    tokenId: item.tokenId,
                    winner: winnerAddress,
                    highestAmount: (finalAmount.toNumber()).toString(),
                    atAuction: false
                })
            });
            const json = await response.json()
            if (json.success) {
                toast.success(`Item is completed`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                setBidprice('')
                loadAuctionItems()
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

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Skip running the function on the initial render
        }
        loadAuctionItems()
    }, [])
    return (
        <div className='mx-5 my-5'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <h2 style={{ textAlign: "center" }}>Create & buy the Auction Items</h2>
            <div className='my-5'>
                <h4>Unsolded Items</h4>
                {unsoldedItems.length > 0 ? (
                    <div className="row" >
                        {unsoldedItems.map((item, idx) => (
                            <div key={idx} className="col my-3" style={{ maxWidth: "fit-content" }}>
                                <div className="overflow-hidden" style={{ width: "16rem", height: "21rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                    <Link to={'/auction/' + item.network + '/' + item.tokenId} >
                                        <img src={item.previewImage !== "" ? item.previewImage : item.file} alt="..." style={{ width: "16rem", height: "12rem" }} />
                                    </Link>
                                    <div className="card-body">
                                        <h3 className="card-title mx-3">{item.name}</h3>
                                        <span className='mx-3'>Base price {item.basePrice} ETH <span style={{ color: "silver" }}>({item.network})</span><span style={{ color: "red" }}>*</span></span>
                                        {item.owner !== account ?
                                            (<div>
                                                <input className='mx-3 my-1' onChange={(e) => setBidprice(e.target.value)} type="number" style={{ textAlign: "center", width: "14rem" }} placeholder='Enter bid price in ETH'></input>
                                                <button className="btn btn-primary mx-3" style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }} onClick={() => bidTheItem(item)}>Bid Item</button>
                                            </div>
                                            ) : (
                                                <div className='my-4'>
                                                    <button className="btn btn-primary mx-3" onClick={() => announceItemWinner(item)} style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }}>Announce Winner</button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden" style={{ width: "16rem", height: "21rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%", textAlign: "center" }}><h2 style={{ marginTop: "9rem" }}>NULL</h2>
                    </div>
                )}
            </div>
            <div>
                <h4>Solded Items</h4>
                {soldedItems.length > 0 ? (
                    <div className="row">
                        {soldedItems.map((item, idx) => (
                            <div key={idx} className="col my-3" style={{ maxWidth: "fit-content" }}>
                                <div className="overflow-hidden" style={{ width: "16rem", height: "21rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                    <Link to={'/auction/' + item.network + '/' + item.tokenId} >
                                        <img src={item.previewImage !== "" ? item.previewImage : item.file} alt="..." style={{ width: "16rem", height: "12rem" }} />
                                    </Link>
                                    <div className="card-body">
                                        <h3 className="card-title mx-3">{item.name}</h3>
                                        <span className='mx-3'>Solded for {item.highestAmount} ETH <span style={{ color: "silver" }}>({item.network})</span></span>
                                        <div className='my-3'>
                                            <Link to={'/auction/' + item.network + '/' + item.tokenId} >
                                                <button className="btn btn-primary mx-3" style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }}>Bidding Details</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden" style={{ width: "16rem", height: "21rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%", textAlign: "center" }}><h2 style={{ marginTop: "9rem" }}>NULL</h2>
                    </div>
                )}
            </div>
        </div >
    )
}

export default Auctions