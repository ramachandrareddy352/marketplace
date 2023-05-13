import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Buffer } from 'buffer'
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

const CreateCollection = ({ account, networkName }) => {
    const context = useContext(NftContext);
    const { updatecollectioninfo } = context;

    let history = useNavigate();

    const [profile, setProfile] = useState("")
    const [background, setBackground] = useState("")
    const [collectionName, setCollectionName] = useState('')
    const [collectionDescription, setCollectionDescription] = useState("")
    const [network, setNetwork] = useState("")
    const [category, setCategory] = useState("")

    const [loadprofile, setloadProfile] = useState(false);
    const [loadbackground, setloadBackground] = useState(false);

    const profileToIPFS = async (event) => {
        setloadProfile(true)
        event.preventDefault()
        const file = event.target.files[0]
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file)
                console.log(result)
                setProfile(`https://ipfs.io/ipfs/${result.path}`)
            } catch (error) {
                console.log("ipfs image upload error: ", error)
            }
        }
        setloadProfile(false)
    }
    const backgroundToIPFS = async (event) => {
        setloadBackground(true)
        event.preventDefault()
        const file = event.target.files[0]
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file)
                console.log(result)
                setBackground(`https://ipfs.io/ipfs/${result.path}`)
            } catch (error) {
                console.log("ipfs image upload error: ", error)
            }
        }
        setloadBackground(false)
    }
    const collectionData = async (e) => {
        e.preventDefault()
        if (account === null) {
            toast.error('Connect to metamask', {
                position: "top-right",
                autoClose: 2000,
            });
            return
        }
        else if (profile === "" || background === "" || collectionName === "" || collectionDescription === "" || network === "" || category === "") {
            toast.error('Please fill all the required fields!', {
                position: "top-right",
                autoClose: 2000,
            });
            return
        }
        else if (collectionName.length < 5 || collectionName.length > 20) {
            toast.error('Length of name should be b/w 5-20 chars', {
                position: "top-right",
                autoClose: 2000,
            });
            return
        }
        else if (collectionDescription.length < 10 || collectionDescription.length > 50) {
            toast.error('Length of descriptionn should be b/w 10-50 chars', {
                position: "top-right",
                autoClose: 2000,
            });
            return
        }
        else {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/collection/createcollection`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        backgroundImage: background,
                        profileImage: profile,
                        name: collectionName,
                        description: collectionDescription,
                        network: network,
                        category: category,
                        walletAddress: account
                    })
                });
                const json = await response.json()
                if (json.success) {
                    updatecollectioninfo(account, collectionName)
                    toast.success(`Created collection successfully`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    history('/collections')
                    setProfile("")
                    setBackground("")
                    setCollectionName('')
                    setCollectionDescription("")
                    setNetwork("")
                    setCategory("")
                }
                else {
                    toast.error(`${json.error}`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                }
            }
            catch (error) {
                console.log(error)
            }
        }
    }
    const comeBack = () => {
        history("/mycollection")
    }
    return (
        <div>
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
            <div className='container my-5'>
                <button type="button" className="btn btn-outline-dark mx-5" onClick={comeBack} style={{ float: "left" }}>Back</button>
                <h2 style={{ textAlign: "center" }}>Create collection</h2>

                <div className='my-5 mx-5' style={{ float: "left" }}>
                    <b>Select file</b><span style={{ color: "red" }}>*</span><span className='mx-1' style={{ color: "silver" }}>Max size: 10 MB</span><br /><br />
                    <div style={{ width: "15rem", height: "15rem", border: "1px dashed black", boxShadow: "-16px 15px 6px silver", borderRadius: "5%" }}>
                        <img src={profile} alt={loadprofile ? `Uploading to IPFS` : `Collection Image`} style={{ width: "14.9rem", height: "14.9rem", borderRadius: "5%" }} />
                    </div><br />
                    <input type='file' accept='.png, .jpg, .jpeg' onChange={profileToIPFS}></input><br /><br />

                    <div >
                        <b>Preview Image</b><span style={{ color: "red" }}>*</span><br /><br />
                        <div style={{ width: "19rem", height: "15rem", border: "1px dashed black", boxShadow: "-16px 15px 6px silver", borderRadius: "5%" }}>
                            <img src={background} alt={loadbackground ? `Uploading to IPFS` : `Collection background Image`} style={{ width: "18.9rem", height: "14.9rem", borderRadius: "5%" }} />
                        </div><br />
                        <input type='file' accept='.png, .jpg, .jpeg' onChange={backgroundToIPFS}></input>
                    </div>
                </div>
                <div className='container col-lg-12 mx-auto my-5' style={{ maxWidth: "700px", float: "right" }} >
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label"><b>Colllection Name<span style={{ color: "red" }}>*</span></b></label>
                        <p>All the NFT will placed in any one of your selected collection</p>
                        <input type="text" className="form-control" onChange={(e) => setCollectionName(e.target.value)} id="name" placeholder="Collection Name" />
                    </div><br />

                    <div className="mb-3">
                        <label htmlFor="desc" className="form-label"><b>Colllection Description<span style={{ color: "red" }}>*</span></b></label>
                        <p>The description will be included on the collections's detail page underneath its image. Markdown syntax is supported.</p>
                        <textarea className="form-control" id="desc" onChange={(e) => setCollectionDescription(e.target.value)} rows="5" placeholder="Provide a detailed description about your collection"></textarea>
                    </div><br />

                    <b>Select Network<span style={{ color: "red" }}>*</span></b>
                    <p>All your items all minted for this particular network only.</p>
                    <select className="form-select form-select mb-3" onChange={(e) => setNetwork(e.target.value)} aria-label=".form-select-lg example">
                        <option value="" className='bg-primary bg-opacity-25'>select Network</option>
                        <option value="goerli">Goerli</option>
                        <option value="sepolia">Sepolia</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="hardhat">Hardhat</option>
                    </select><br />

                    <div className="mb-3">
                        <b>Select Category</b><span style={{ color: "red" }}>*</span><br />
                        <label htmlFor="name" className="form-label">All your minted items shouldbelongs to this category.</label>
                        <select className="form-select mb-3 bg-light" aria-label=".form-select-lg example" onChange={(e) => setCategory(e.target.value)} >
                            <option value="" className='bg-primary bg-opacity-25'>Select the Category Type</option>
                            <option value="Arts">Art</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Music">Music</option>
                            <option value="Nature">Nature</option>
                            <option value="Books">Books</option>
                            <option value="PFPs">PFPs</option>
                            <option value="VirtualWorld">Virtual World</option>
                            <option value="Others">Others</option>
                        </select>
                    </div><br />

                    <div style={{ textAlign: "center" }}>
                        <button type="button" className="btn btn-primary mx-auto" onClick={collectionData} style={{ width: "300px" }}>Create</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CreateCollection
