import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import image_404 from '../images/404_page_cover.jpg'

const CompletedAuction = () => {
    const params = useParams()
    let history = useNavigate();

    const [itemDetails, setItemDetails] = useState({})
    const [itemfounded, setItemfounded] = useState(false)
    const [biddedInfo, setBiddedInfo] = useState([])
    const [confirmation, setConfirmation] = useState(false)
    let serial = 1;

    const loadauctionitem = async () => {
        setItemfounded(false)
        setBiddedInfo([])
        setConfirmation(false)
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/auction/fetchauctionitem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tokenId: params.tokenid,
                    network: params.network
                })
            });
            const json = await response.json()
            if (json.success) {
                setItemDetails(json.nft)
                setConfirmation(json.nft.atAuction ? true : false)
                setItemfounded(true)
                // if item auction is completed
                if (!confirmation) {
                    console.log(confirmation)
                    const response2 = await fetch(`http://127.0.0.1:5000/api/bid/fetchbiditem`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            tokenId: params.tokenid,
                            network: params.network
                        })
                    });
                    const json2 = await response2.json()
                    if (json2.success) {
                        setBiddedInfo(json2.nfts)
                        setItemfounded(true)
                    }
                    else {
                        setItemfounded(false)
                        toast.error(`${json2.error}`, {
                            position: "top-right",
                            autoClose: 2000,
                        });
                        return;
                    }
                }
            }
            else {
                setItemfounded(false)
                toast.error(`${json.error}`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                return;
            }
        } catch (error) {
            console.log(error);
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
        loadauctionitem()
    }, [])
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
            {itemfounded ? (
                <div>
                    <h1 className='my-5' style={{ textAlign: "center" }}>Auction item details</h1>
                    <div className='mx-5'>
                        {itemDetails.filetype !== "image" &&
                            <img src={itemDetails.previewImage} alt=".." width="300rem" height="400rem" className='mx-4' style={{ borderRadius: "10%", float: "left", boxShadow: "16px 16px 8px dimgray" }}></img>
                        }
                        {itemDetails.filetype === "video" &&
                            <video src={itemDetails.file} alt="..." className='mx-4' width="300rem" height="400rem" type="video/mp4" style={{ borderRadius: "10%", boxShadow: "16px 16px 8px dimgray" }} controls>
                            </video>
                        }
                        {itemDetails.filetype === "audio" &&
                            <audio controls width="300rem" height="400rem" className='mx-4' style={{ borderRadius: "10%", boxShadow: "16px 16px 8px dimgray" }} src={itemDetails.file} type="audio/mpeg" alt="...">
                            </audio>
                        }
                        {itemDetails.filetype === "pdf" &&
                            <iframe src={itemDetails.file} alt="..." width="300rem" className='mx-4' height="400rem" style={{ borderRadius: "10%", boxShadow: "16px 16px 8px dimgray" }} title="Your IPFS Book"></iframe>
                        }
                        {itemDetails.filetype === "image" &&
                            <img src={itemDetails.file} alt="..." width="300rem" height="400rem" style={{ borderRadius: "10%", boxShadow: "16px 16px 8px dimgray" }} ></img>
                        }
                    </div>
                    <div className='my-5 mx-5'>
                        <h4 className='mx-5'>Name :<span style={{ color: "Dimgray" }}> {itemDetails.name}</span></h4>
                        <h4 className='mx-5'>Description :<span style={{ color: "gray" }}> {itemDetails.description}</span></h4>
                        <h4 className='mx-5'>TokenId :<span style={{ color: "gray" }}> {itemDetails.tokenId}</span></h4>
                        <h4 className='mx-5'>External link :<span style={{ color: "gray" }}> {itemDetails.externalLink}</span></h4>
                        <h4 className='mx-5'>Network :<span style={{ color: "gray" }}> {itemDetails.network}</span></h4>
                        <h4 className='mx-5'>Item Owner :<span style={{ color: "gray" }}> {itemDetails.owner}</span></h4>
                        <h4 className='mx-5'>Base price :<span style={{ color: "gray" }}> {itemDetails.basePrice}</span></h4>
                        <h4 className='mx-5'>Item Winner :<span style={{ color: "gray" }}> {itemDetails.winner}</span></h4>
                        <h4 className='mx-5'>Winnging amount :<span style={{ color: "gray" }}> {itemDetails.highestAmount}</span></h4>
                        <h4 className='mx-5'>Auction :<span style={{ color: "gray" }}> {itemDetails.atAuction ? `Not completed` : `Completed`}</span></h4>
                    </div>
                    {!confirmation &&
                        <table className="container table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">S.NO</th>
                                    <th scope="col">Participate address</th>
                                    <th scope="col">Network</th>
                                    <th scope="col">Bidding Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {biddedInfo.map((item, idx) => (
                                    <tr key={idx}>
                                        <th scope="row">{serial++}</th>
                                        <td>{item.participateAddress}</td>
                                        <td>{item.network}</td>
                                        <td>{item.biddingPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                    <br /><br /><br /><br />
                </div>
            ) : (
                <div style={{ backgroundImage: `url(${image_404})`, backgroundRepeat: "no-repeat", textAlign: "center", height: "40rem", backgroundSize: "100% 40rem", }}>
                    <button className='btn btn-outline-dark' style={{ marginTop: "2rem" }} onClick={comeback}>Home</button>
                </div>
            )}
        </div>
    )
}

export default CompletedAuction