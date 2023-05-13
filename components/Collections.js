import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Collections = ({ account, networkName }) => {

    const [allCollections, getAllCollections] = useState([])
    let history = useNavigate();

    const loadCollections = async () => {
        getAllCollections([])
        if (account === null) {
            toast.error(`Please connect metamask`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
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
            getAllCollections(json.collections)
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
    const checkConnection = () => {
        if (account === null) {
            toast.error(`Please connect metamask`, {
                position: "top-right",
                autoClose: 5000,
            });
        }
    }
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Skip running the function on the initial render
        }
        loadCollections();
    }, []);

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

            <Link to="/createCollection" >
                <button type="button" className="btn btn-outline-primary btn-lg my-3" style={{ width: "15rem", height: "4rem", fontSize: "20px" }} onClick={checkConnection}>
                    Create New Collection
                </button>
            </Link>

            <button type="button" className="btn btn-outline-primary  my-3" onClick={loadCollections} style={{ float: "right" }} id="handleClick">
                load
            </button>

            {allCollections.length !== 0 ? (
                <div className='container'>
                    <div xs={1} md={2} lg={4} className="row g-6 py-5">
                        {allCollections.map((item, idx) => (
                            <div key={idx} className="col my-3">
                                <div className="overflow-hidden" style={{ width: "20rem", height: "18rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "20rem 12rem", borderRadius: "10%" }}>
                                    <img src={item.profileImage} className='mx-4' alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white" }} />
                                    <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "130px" }}>{item.name}</h4>
                                    <div className='my-2'>
                                        <span className='mx-5'>
                                            <Link to={'/mycollection/' + item.name} style={{ color: "black", textDecoration: "none" }}><i className="fa-solid fa-eye fa-bounce mx-2"></i><b>View</b>
                                            </Link>
                                        </span>
                                        <span className='mx-4'><i className="fa-solid fa-trash mx-2"></i><b>Delete</b></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h2>You have zero collections</h2>
                </div>
            )}
        </div>
    )
}

export default Collections