import React, { useEffect, useState, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'

const AuctionItems = ({ account, networkName }) => {
    const [allItems, setAllItems] = useState([])

    let address = account;

    const loadAuctionItems = async (address) => {
        if (address === null) {
            toast.error(`Connect to metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
        const response = await fetch(`http://127.0.0.1:5000/api/auction/fetchmyauctionitem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                owner: address
            })
        });
        const json = await response.json()
        if (json.success) {
            setAllItems(json.nft)
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

    window.ethereum.on('accountsChanged', async function (accounts) {
        address = accounts[0]
        loadAuctionItems(address)
    })
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Skip running the function on the initial render
        }
        loadAuctionItems(address)
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
            <h1 className='my-5' style={{ textAlign: "center" }}>My Auction Items</h1>
            {allItems.length > 0 ? (
                <div className="row">
                    {allItems.map((item, idx) => (
                        <div key={idx} className="col my-3" style={{ maxWidth: "fit-content" }}>
                            <div className="overflow-hidden" style={{ width: "16rem", height: "22.5rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <Link to={'/auction/' + item.network + '/' + item.tokenId} >
                                    <img src={item.previewImage === "" ? item.file : item.previewImage} alt="..." style={{ width: "16rem", height: "14rem" }} />
                                </Link>
                                <div className="card-body">
                                    <h3 className="card-title mx-3 my-2">{item.name}</h3>
                                    <span style={{ float: "right", color: "silver", marginTop: "-35px", marginRight: "20px" }}>{item.network}</span>
                                    <div className='my-2 mx-3'><b>{item.atAuction ? `Item is at Auction` : `Auction is Completed`}</b></div>
                                    <Link to={'/auction/' + item.network + '/' + item.tokenId} >
                                        <button className="btn btn-primary my-1 mx-3" style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }} >View Details</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <div className="overflow-hidden my-5" style={{ width: "16rem", height: "22.5rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%", textAlign: "center" }}>
                        <h1 style={{ marginTop: "140px" }}>NULL</h1>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AuctionItems