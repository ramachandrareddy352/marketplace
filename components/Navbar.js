import { Link, useLocation } from "react-router-dom";
import market from '../images/image-1.webp'
import React, { useEffect } from 'react'

const Navbar = ({ connectWallet, account }) => {
    let location = useLocation();
    useEffect(() => { }, [location])

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 bg-gradient fixed-top">
                <div className="container-fluid">
                    <Link className="navbar-brand mx-4" to="/">
                        <img src={market} alt="logo" width="50px" height="30px" />&nbsp;&nbsp; NFT Marketplace
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse mx-3" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 my-3">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/auctions" ? "active" : ""}`} to="/auctions">Auctions</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/private" ? "active" : ""}`} to="/private">Private</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/guide" ? "active" : ""}`} to="/guide">Guide</Link>
                            </li>
                            <li className="nav-item mx-3">
                            </li>
                            <li className="nav-item">
                                <form className="d-flex mx-5" role="search">
                                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" style={{ maxWidth: '400px' }} />
                                    <button className="btn btn-outline-light disabled" type="submit">
                                        search
                                    </button>
                                </form>
                            </li>
                            <li className={`nav-item dropdown mx-3  ${location.pathname === ("/collections" || "/createnft" || "/auctionitems" || "/owneditems" || "/mycart" || "/about" || "/contact") ? "active" : ""}`}>
                                <p className="nav-link dropdown-toggle active" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Profile
                                </p>
                                <ul className="dropdown-menu">
                                    <li><Link className={"dropdown-item"} to="/mycollection">Collections</Link></li>
                                    <li><Link className={"dropdown-item"} to="/createnft">Create NFT</Link></li>
                                    <li><Link className={"dropdown-item"} to="/auctionitems">Auction items</Link></li>
                                    <li><Link className={"dropdown-item"} to="/owneditems">Owned Items</Link></li>
                                    <li><Link className={"dropdown-item"} to="/mycart">My Cart</Link></li>
                                    <li><Link className={"dropdown-item"} to="/about">About</Link></li>
                                    <li><Link className={"dropdown-item"} to="/contact">Contact</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item mx-5">
                            </li>
                            <li className="nav-item text-white my-2 mx-2">
                                <div className="form-check form-switch">
                                    Dark mode<input className="form-check-input" type="checkbox" role="switch" />
                                </div>
                            </li>
                        </ul>
                        {account ? (
                            <Link
                                to={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm ">
                                <button className="btn btn-outline-light mx-3">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </button>
                            </Link>
                        ) : (
                            <button onClick={connectWallet} className="btn btn-outline-light mx-3">Connect Wallet</button>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;