import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import image_404 from '../images/404_page_cover.jpg'

const MarketplaceModal = () => {
    const params = useParams()
    let history = useNavigate();

    const [itemDetails, setItemDetails] = useState({})
    const [itemfounded, setItemfounded] = useState(false)

    const loadauctionitem = async () => {
        setItemfounded(false)
        const response = await fetch(`http://127.0.0.1:5000/api/create/fetchparticularnft`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                collectionName: params.name,
                tokenId: params.tokenid,
                network: params.network
            })
        });
        const json = await response.json()
        if (json.success) {
            setItemDetails(json.nft)
            setItemfounded(true)
            return;
        }
        else {
            setItemfounded(false)
            toast.error(`${json.error}`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
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
                    <h1 className='my-5' style={{ textAlign: "center" }}>Marketplace item details</h1>
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
                        <h4 className='mx-5'>Collection Name :<span style={{ color: "Dimgray" }}> {itemDetails.collectionName}</span></h4>
                        <h4 className='mx-5'>Category :<span style={{ color: "Dimgray" }}> {itemDetails.category}</span></h4>
                        <h4 className='mx-5'>TokenId :<span style={{ color: "gray" }}> {itemDetails.tokenId}</span></h4>
                        <h4 className='mx-5'>External link :<span style={{ color: "gray" }}> {itemDetails.externalLink}</span></h4>
                        <h4 className='mx-5'>Network :<span style={{ color: "gray" }}> {itemDetails.network}</span></h4>
                        <h4 className='mx-5'>Item Price :<span style={{ color: "gray" }}> {itemDetails.price}</span></h4>
                        <h4 className='mx-5'>Private or Public :<span style={{ color: "gray" }}> {itemDetails.privateState ? `Private` : `Public`}</span></h4>
                        <h4 className='mx-5'>Item Owner :<span style={{ color: "gray" }}> {itemDetails.owner}</span></h4>
                        <h4 className='mx-5'>Item current seller :<span style={{ color: "gray" }}> {itemDetails.currentSeller}</span></h4>
                        <h4 className='mx-5'>Ready :<span style={{ color: "gray" }}> {itemDetails.ready ? `Ready to buy` : `Not ready`}</span></h4>
                    </div>
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

export default MarketplaceModal