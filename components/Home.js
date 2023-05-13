import { useState, useEffect, useRef, useContext } from 'react'
import image1 from '../images/image-1.webp'
import image2 from '../images/img2.jpg'
import image3 from '../images/img3.jpg'
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css'

const Home = () => {

    const [allCollections, setAllCollections] = useState([])
    const [artCollections, setArtCollections] = useState([])
    const [gamingCollections, setGamingCollections] = useState([])
    const [booksCollections, setBooksCollections] = useState([])
    const [natureCollections, setNatureCollections] = useState([])
    const [pfpsCollections, setPfpsCollections] = useState([])
    const [musicCollections, setMusicCollections] = useState([])
    const [virtualworldCollections, setVirtualworldCollections] = useState([])
    const [otherCollections, setOtherCollections] = useState([])

    const loadAllCollections = async () => {
        const response = await fetch(`http://127.0.0.1:5000/api/collection/fetchallcollections`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json()
        if (json.success) {
            setAllCollections(json.collections)
            const response1 = await fetch(`http://127.0.0.1:5000/api/collection/fetchcategorycollections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: "Arts"
                })
            });
            const json1 = await response1.json()
            if (json1.success) {
                setArtCollections(json1.collections)
            }
            const response2 = await fetch(`http://127.0.0.1:5000/api/collection/fetchcategorycollections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: "Gaming"
                })
            });
            const json2 = await response2.json()
            if (json2.success) {
                setGamingCollections(json2.collections)
            }
            const response3 = await fetch(`http://127.0.0.1:5000/api/collection/fetchcategorycollections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: "Music"
                })
            });
            const json3 = await response3.json()
            if (json3.success) {
                setMusicCollections(json3.collections)
            }
            const response4 = await fetch(`http://127.0.0.1:5000/api/collection/fetchcategorycollections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: "Books"
                })
            });
            const json4 = await response4.json()
            if (json4.success) {
                setBooksCollections(json4.collections)
            }
            const response5 = await fetch(`http://127.0.0.1:5000/api/collection/fetchcategorycollections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: "Nature"
                })
            });
            const json5 = await response5.json()
            if (json5.success) {
                setNatureCollections(json5.collections)
            }
            const response6 = await fetch(`http://127.0.0.1:5000/api/collection/fetchcategorycollections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: "PFPs"
                })
            });
            const json6 = await response6.json()
            if (json6.success) {
                setPfpsCollections(json6.collections)
            }
            const response7 = await fetch(`http://127.0.0.1:5000/api/collection/fetchcategorycollections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: "VirtualWorld"
                })
            });
            const json7 = await response7.json()
            if (json7.success) {
                setVirtualworldCollections(json7.collections)
            }
            const response8 = await fetch(`http://127.0.0.1:5000/api/collection/fetchcategorycollections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: "Others"
                })
            });
            const json8 = await response8.json()
            if (json8.success) {
                setOtherCollections(json8.collections)
            }
        }
        else {
            toast.error(`${json.error}`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
    }

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Skip running the function on the initial render
        }
        loadAllCollections()
    }, [])
    return (
        <div>
            <div className='mx-5 my-5' >
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
                <nav id="navbar-example2" className="navbar bg-body-tertiary px-3 mb-3" style={{ borderRadius: "50px" }}>
                    <ul className="nav nav-pills" style={{ fontSize: "25px" }}>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="#Heading1">ALL</a>
                        </li>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="#Heading2">Arts</a>
                        </li>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="#Heading3">Gaming</a>
                        </li>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="#Heading4">Music</a>
                        </li>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="#Heading5">Books</a>
                        </li>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="#Heading6">Nature</a>
                        </li>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="#Heading7">PFPs</a>
                        </li>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="#Heading8">Virtual world</a>
                        </li>
                        <li className="nav-item mx-4">
                            <a className="nav-link" href="#Heading9">Others</a>
                        </li>
                    </ul>
                </nav>
                <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel"  >
                    <div className="carousel-inner" style={{ height: "30rem" }}>
                        <div className="carousel-item active" data-bs-interval="3000">
                            <img src={image1} className="d-block w-100" style={{ height: "30rem" }} alt="..." />
                        </div>
                        <div className="carousel-item" data-bs-interval="3000">
                            <img src={image2} className="d-block w-100" style={{ height: "30rem" }} alt="..." />
                        </div>
                        <div className="carousel-item" data-bs-interval="3000">
                            <img src={image3} className="d-block w-100" style={{ height: "30rem" }} alt="..." />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
                <div><br /><br />
                    <div className='my-5' id="Heading1">
                        <h3>Trending in All</h3>
                        {allCollections.length > 0 ? (
                            <div className="scrollmenu">
                                {allCollections.map((item, idx) => (
                                    <div key={idx}>
                                        <Link to={'/collection/' + item.name}>
                                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "18rem 12rem", borderRadius: "10%" }}>
                                                <img src={item.profileImage} alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white", marginLeft: "-180px" }} />
                                                <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "80px" }}>{item.name}</h4>
                                                <div>
                                                    <span style={{ float: "left", color: "silver" }}>Floor price</span>
                                                    <span style={{ marginLeft: "70px", color: "silver" }}>Total volume</span><br />
                                                    <div>
                                                        <span style={{ marginTop: "30px", marginLeft: "-20px" }}>{item.floorPrice} ETH</span>
                                                        <span style={{ marginLeft: "120px" }}>{item.totalVolume} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}><h3 style={{ textAlign: "center", marginTop: "150px" }}>Collections NULL</h3>
                            </div>
                        )}
                    </div>
                    <div className='my-5' id="Heading2">
                        <h3>Trending in Arts</h3>
                        {artCollections.length > 0 ? (
                            <div className="scrollmenu">
                                {artCollections.map((item, idx) => (
                                    <div key={idx}>
                                        <Link to={'/collection/' + item.name}>
                                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "18rem 12rem", borderRadius: "10%" }}>
                                                <img src={item.profileImage} alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white", marginLeft: "-180px" }} />
                                                <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "80px" }}>{item.name}</h4>
                                                <div>
                                                    <span style={{ float: "left", color: "silver" }}>Floor price</span>
                                                    <span style={{ marginLeft: "70px", color: "silver" }}>Total volume</span><br />
                                                    <div>
                                                        <span style={{ marginTop: "30px", marginLeft: "-20px" }}>{item.floorPrice} ETH</span>
                                                        <span style={{ marginLeft: "120px" }}>{item.totalVolume} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <h3 style={{ textAlign: "center", marginTop: "150px" }}>Collections NULL</h3>
                            </div>
                        )}
                    </div>
                    <div className='my-5' id="Heading3">
                        <h3>Trending in Gaming</h3>
                        {gamingCollections.length > 0 ? (
                            <div className="scrollmenu">
                                {gamingCollections.map((item, idx) => (
                                    <div key={idx}>
                                        <Link to={'/collection/' + item.name}>
                                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "18rem 12rem", borderRadius: "10%" }}>
                                                <img src={item.profileImage} alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white", marginLeft: "-180px" }} />
                                                <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "80px" }}>{item.name}</h4>
                                                <div>
                                                    <span style={{ float: "left", color: "silver" }}>Floor price</span>
                                                    <span style={{ marginLeft: "70px", color: "silver" }}>Total volume</span><br />
                                                    <div>
                                                        <span style={{ marginTop: "30px", marginLeft: "-20px" }}>{item.floorPrice} ETH</span>
                                                        <span style={{ marginLeft: "120px" }}>{item.totalVolume} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <h3 style={{ textAlign: "center", marginTop: "150px" }}>Collections NULL</h3>
                            </div>
                        )}
                    </div>
                    <div className='my-5' id="Heading4">
                        <h3>Trending in Music</h3>
                        {musicCollections.length > 0 ? (
                            <div className="scrollmenu">
                                {musicCollections.map((item, idx) => (
                                    <div key={idx}>
                                        <Link to={'/collection/' + item.name}>
                                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "18rem 12rem", borderRadius: "10%" }}>
                                                <img src={item.profileImage} alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white", marginLeft: "-180px" }} />
                                                <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "80px" }}>{item.name}</h4>
                                                <div>
                                                    <span style={{ float: "left", color: "silver" }}>Floor price</span>
                                                    <span style={{ marginLeft: "70px", color: "silver" }}>Total volume</span><br />
                                                    <div>
                                                        <span style={{ marginTop: "30px", marginLeft: "-20px" }}>{item.floorPrice} ETH</span>
                                                        <span style={{ marginLeft: "120px" }}>{item.totalVolume} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <h3 style={{ textAlign: "center", marginTop: "150px" }}>Collections NULL</h3>
                            </div>
                        )}
                    </div>
                    <div className='my-5' id="Heading5">
                        <h3>Trending in Books</h3>
                        {booksCollections.length > 0 ? (
                            <div className="scrollmenu">
                                {booksCollections.map((item, idx) => (
                                    <div key={idx}>
                                        <Link to={'/collection/' + item.name}>
                                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "18rem 12rem", borderRadius: "10%" }}>
                                                <img src={item.profileImage} alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white", marginLeft: "-180px" }} />
                                                <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "80px" }}>{item.name}</h4>
                                                <div>
                                                    <span style={{ float: "left", color: "silver" }}>Floor price</span>
                                                    <span style={{ marginLeft: "70px", color: "silver" }}>Total volume</span><br />
                                                    <div>
                                                        <span style={{ marginTop: "30px", marginLeft: "-20px" }}>{item.floorPrice} ETH</span>
                                                        <span style={{ marginLeft: "120px" }}>{item.totalVolume} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <h3 style={{ textAlign: "center", marginTop: "150px" }}>Collections NULL</h3>
                            </div>
                        )}
                    </div>
                    <div className='my-5' id="Heading6">
                        <h3>Trending in Nature</h3>
                        {natureCollections.length > 0 ? (
                            <div className="scrollmenu">
                                {natureCollections.map((item, idx) => (
                                    <div key={idx}>
                                        <Link to={'/collection/' + item.name}>
                                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "18rem 12rem", borderRadius: "10%" }}>
                                                <img src={item.profileImage} alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white", marginLeft: "-180px" }} />
                                                <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "80px" }}>{item.name}</h4>
                                                <div>
                                                    <span style={{ float: "left", color: "silver" }}>Floor price</span>
                                                    <span style={{ marginLeft: "70px", color: "silver" }}>Total volume</span><br />
                                                    <div>
                                                        <span style={{ marginTop: "30px", marginLeft: "-20px" }}>{item.floorPrice} ETH</span>
                                                        <span style={{ marginLeft: "120px" }}>{item.totalVolume} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <h3 style={{ textAlign: "center", marginTop: "150px" }}>Collections NULL</h3>
                            </div>
                        )}
                    </div>
                    <div className='my-5' id="Heading7">
                        <h3>Trending in PFPs</h3>
                        {pfpsCollections.length > 0 ? (
                            <div className="scrollmenu">
                                {pfpsCollections.map((item, idx) => (
                                    <div key={idx}>
                                        <Link to={'/collection/' + item.name}>
                                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "18rem 12rem", borderRadius: "10%" }}>
                                                <img src={item.profileImage} alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white", marginLeft: "-180px" }} />
                                                <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "80px" }}>{item.name}</h4>
                                                <div>
                                                    <span style={{ float: "left", color: "silver" }}>Floor price</span>
                                                    <span style={{ marginLeft: "70px", color: "silver" }}>Total volume</span><br />
                                                    <div>
                                                        <span style={{ marginTop: "30px", marginLeft: "-20px" }}>{item.floorPrice} ETH</span>
                                                        <span style={{ marginLeft: "120px" }}>{item.totalVolume} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <h3 style={{ textAlign: "center", marginTop: "150px" }}>Collections NULL</h3>
                            </div>
                        )}
                    </div>
                    <div className='my-5' id="Heading8">
                        <h3>Trending in VirtualWorld</h3>
                        {virtualworldCollections.length > 0 ? (
                            <div className="scrollmenu">
                                {virtualworldCollections.map((item, idx) => (
                                    <div key={idx}>
                                        <Link to={'/collection/' + item.name}>
                                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "18rem 12rem", borderRadius: "10%" }}>
                                                <img src={item.profileImage} alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white", marginLeft: "-180px" }} />
                                                <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "80px" }}>{item.name}</h4>
                                                <div>
                                                    <span style={{ float: "left", color: "silver" }}>Floor price</span>
                                                    <span style={{ marginLeft: "70px", color: "silver" }}>Total volume</span><br />
                                                    <div>
                                                        <span style={{ marginTop: "30px", marginLeft: "-20px" }}>{item.floorPrice} ETH</span>
                                                        <span style={{ marginLeft: "120px" }}>{item.totalVolume} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <h3 style={{ textAlign: "center", marginTop: "150px" }}>Collections NULL</h3>
                            </div>
                        )}
                    </div>
                    <div className='my-5' id="Heading9">
                        <h3>Trending in Other</h3>
                        {otherCollections.length > 0 ? (
                            <div className="scrollmenu">
                                {otherCollections.map((item, idx) => (
                                    <div key={idx}>
                                        <Link to={'/collection/' + item.name}>
                                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", backgroundImage: `url(${item.backgroundImage})`, backgroundRepeat: "no-repeat", backgroundPosition: "top", backgroundSize: "18rem 12rem", borderRadius: "10%" }}>
                                                <img src={item.profileImage} alt="..." style={{ width: "5rem", height: "5rem", borderRadius: "20%", marginTop: "160px", border: "5px solid white", marginLeft: "-180px" }} />
                                                <h4 className="overflow-hidden" style={{ marginBottom: "15px", marginTop: "-40px", marginLeft: "80px" }}>{item.name}</h4>
                                                <div>
                                                    <span style={{ float: "left", color: "silver" }}>Floor price</span>
                                                    <span style={{ marginLeft: "70px", color: "silver" }}>Total volume</span><br />
                                                    <div>
                                                        <span style={{ marginTop: "30px", marginLeft: "-20px" }}>{item.floorPrice} ETH</span>
                                                        <span style={{ marginLeft: "120px" }}>{item.totalVolume} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden" style={{ width: "18rem", height: "22rem", boxShadow: "15px 15px 6px silver", border: "1px dashed black", borderRadius: "10%" }}>
                                <h3 style={{ textAlign: "center", marginTop: "150px" }}>Collections NULL</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <hr />
                <h1>Bottom info</h1>
            </div>
        </div >
    )
}

export default Home