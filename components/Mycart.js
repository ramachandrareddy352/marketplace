import React, { useEffect, useState, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from 'react-router-dom'

const Mycart = ({ account, networkName }) => {

    const [cartItems, setCartItems] = useState([])
    let address = account

    const loadCartItems = async (address) => {
        if (address === null) {
            toast.error(`connect to metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
        setCartItems([])
        const response1 = await fetch(`http://127.0.0.1:5000/api/cart/fetchcartitems`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                walletAddress: address
            })
        });
        const json1 = await response1.json()
        if (json1.success) {
            setCartItems(json1.cartitems)
        }
        else {
            toast.error(`${json1.error}`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
    }
    const removeCart = async (item) => {
        if (account === null) {
            toast.error(`Connect your metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        const response1 = await fetch(`http://127.0.0.1:5000/api/cart/deletecartitem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                walletAddress: address,
                cartId: item.cartId,
                network: item.network,
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
            toast.success(`Item is removed successfully`, {
                position: "top-right",
                autoClose: 2000,
            });
            loadCartItems(address)
        }
    }
    window.ethereum.on('accountsChanged', async function (accounts) {
        address = accounts[0]
        loadCartItems(address)
    })
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Skip running the function on the initial render
        }
        loadCartItems(address)
    }, [])
    return (
        <div className='container my-5'>
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
            <h1 style={{ textAlign: "center" }}>My Cart Items</h1>
            {cartItems.length > 0 ? (
                <div className="row">
                    {cartItems.map((item, idx) => (
                        <div key={idx} className="col my-3" style={{ maxWidth: "fit-content" }}>
                            <div className="overflow-hidden" style={{ width: "16rem", height: "22.5rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <Link to={'/' + item.collectionName + '/' + item.network + '/' + item.cartId} >
                                    <img src={item.previewImage === "" ? item.file : item.previewImage} alt="..." style={{ width: "16rem", height: "16rem" }} />
                                </Link>
                                <div className="card-body">
                                    <h3 className="card-title mx-3 my-2">{item.name}</h3>
                                    <span style={{ float: "right", color: "silver", marginTop: "-35px", marginRight: "20px" }}>({item.privateState ? `Private` : `Public`})</span>
                                    <button className="btn btn-primary my-1 mx-3" style={{ textAlign: "center", width: "14rem", borderRadius: "30px" }} onClick={() => removeCart(item)}>Remove cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <div className="overflow-hidden" style={{ width: "16rem", height: "22.5rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%", textAlign: "center" }}>
                        <h1 style={{ marginTop: "140px" }}>NULL</h1>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Mycart