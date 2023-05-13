import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// components
import Navbar from './Navbar'
import Home from './Home'
import Auctions from './Auctions';
import Guide from './Guide'
import Collections from './Collections';
import CreateNft from './CreateNft';
import Private from './Private.js';
import Mycart from './Mycart';
import AuctionItems from './AuctionItems';
import CreateCollection from './CreateCollection';
import OwnedItems from './OwnedItems';
import ContextState from '../../frontend/context/ContextState';
import CompletedAuction from '../modals/CompletedAuctionModal'
import OwnCollectionModal from '../modals/OwnCollectionModal'
import CollectionModal from '../modals/CollectionModal'
import MarketplaceModal from '../modals/MarketplaceModal';
import ErrorPage from './ErrorPage';

// smart contract abi
import nftMarketplaceAbi from '../../backend/artifacts/src/backend/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import marketplaceAbi from '../../backend/artifacts/src/backend/contracts/Marketplace.sol/marketplace.json'
import nftAuctionAbi from '../../backend/artifacts/src/backend/contracts/NFTAuction.sol/NFTAuction.json'
import auctionAbi from '../../backend/artifacts/src/backend/contracts/Auction.sol/auction.json'
// smart contract deployed address
import goerliNftMarketplaceAddress from '../contractsData/nftMarketplace-goerli-address.json'
import sepoliaNftMarketplaceAddress from '../contractsData/nftMarketplace-sepolia-address.json'
import mumbaiNftMarketplaceAddress from '../contractsData/nftMarketplace-mumbai-address.json'
import hardhatNftMarketplaceAddress from '../contractsData/nftMarketplace-hardhat-address.json'
import goerliNftAuctionAddress from '../contractsData/nftAuction-goerli-address.json'
import sepoliaNftAuctionAddress from '../contractsData/nftAuction-sepolia-address.json'
import mumbaiNftAuctionAddress from '../contractsData/nftAuction-mumbai-address.json'
import hardhatNftAuctionAddress from '../contractsData/nftAuction-hardhat-address.json'
import goerliMarketplaceAddress from '../contractsData/marketplace-goerli-address.json'
import sepoliaMarketplaceAddress from '../contractsData/marketplace-sepolia-address.json'
import mumbaiMarketplaceAddress from '../contractsData/marketplace-mumbai-address.json'
import hardhatMarketplaceAddress from '../contractsData/marketplace-hardhat-address.json'
import goerliAuctionAddress from '../contractsData/auction-goerli-address.json'
import sepoliaAuctionAddress from '../contractsData/auction-sepolia-address.json'
import mumbaiAuctionAddress from '../contractsData/auction-mumbai-address.json'
import hardhatAuctionAddress from '../contractsData/auction-hardhat-address.json'

function App() {

  const [account, setAccount] = useState(null)
  const [nftMarketplaceGoerli, setNftMarketplaceGoerli] = useState({})
  const [marketplaceGoerli, setMarketplaceGoerli] = useState({})
  const [nftAuctionGoerli, setNftAuctionGoerli] = useState({})
  const [auctionGoerli, setAuctionGoerli] = useState({})
  const [nftMarketplaceMumbai, setNftMarketplaceMumbai] = useState({})
  const [marketplaceMumbai, setMarketplaceMumbai] = useState({})
  const [nftAuctionMumbai, setNftAuctionMumbai] = useState({})
  const [auctionMumbai, setAuctionMumbai] = useState({})
  const [nftMarketplaceSepolia, setNftMarketplaceSepolia] = useState({})
  const [marketplaceSepolia, setMarketplaceSepolia] = useState({})
  const [nftAuctionSepolia, setNftAuctionSepolia] = useState({})
  const [auctionSepolia, setAuctionSepolia] = useState({})
  const [nftMarketplaceHardhat, setNftMarketplaceHardhat] = useState({})
  const [marketplaceHardhat, setMarketplaceHardhat] = useState({})
  const [nftAuctionHardhat, setNftAuctionHardhat] = useState({})
  const [auctionHardhat, setAuctionHardhat] = useState({})
  const [networkName, setNetworkName] = useState('others')

  // MetaMask Login/Connect
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0])
      // get network name
      window.ethereum.request({ method: 'eth_chainId' })
        .then(chainId => {
          switch (chainId) {
            case '0x5':
              setNetworkName("goerli");
              break;
            case '0x539':
              setNetworkName("hardhat")
              break;
            case '0x13881':
              setNetworkName("mumbai");
              break;
            case '0xaa36a7':
              setNetworkName("sepolia")
              break;
            default:
              setNetworkName("others");
          }
        })
        .catch(error => console.log(error));
      // if account changed
      window.ethereum.on('accountsChanged', async function (accounts) {
        setAccount(accounts[0])
      })
    }
    else {
      toast.error(`Please install Metamask`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }
  // network changed
  window.ethereum.on('chainChanged', async (chainId) => {
    window.ethereum.request({ method: 'eth_chainId' })
      .then(chainId => {
        switch (chainId) {
          case '0x5':
            setNetworkName("goerli");
            break;
          case '0x539':
            setNetworkName("hardhat")
            break;
          case '0x13881':
            setNetworkName("mumbai");
            break;
          case '0xaa36a7':
            setNetworkName("sepolia")
            break;
          default:
            setNetworkName("others");
        }
      })
      .catch(error => console.log(error));
  })
  const loadContracts = async () => {

    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)     // Get provider from Metamask
      const signer = provider.getSigner()
      // goerli
      const nftMarketplaceG = new ethers.Contract(goerliNftMarketplaceAddress.address, nftMarketplaceAbi.abi, signer)
      setNftMarketplaceGoerli(nftMarketplaceG)
      const marketplaceG = new ethers.Contract(goerliMarketplaceAddress.address, marketplaceAbi.abi, signer)
      setMarketplaceGoerli(marketplaceG)
      const nftAuctionG = new ethers.Contract(goerliNftAuctionAddress.address, nftAuctionAbi.abi, signer)
      setNftAuctionGoerli(nftAuctionG)
      const auctionG = new ethers.Contract(goerliAuctionAddress.address, auctionAbi.abi, signer)
      setAuctionGoerli(auctionG)
      // mumbai
      const nftMarketplaceM = new ethers.Contract(mumbaiNftMarketplaceAddress.address, nftMarketplaceAbi.abi, signer)
      setNftMarketplaceMumbai(nftMarketplaceM)
      const marketplaceM = new ethers.Contract(mumbaiMarketplaceAddress.address, marketplaceAbi.abi, signer)
      setMarketplaceMumbai(marketplaceM)
      const nftAuctionM = new ethers.Contract(mumbaiNftAuctionAddress.address, nftAuctionAbi.abi, signer)
      setNftAuctionMumbai(nftAuctionM)
      const auctionM = new ethers.Contract(mumbaiAuctionAddress.address, auctionAbi.abi, signer)
      setAuctionMumbai(auctionM)
      // sepolia
      const nftMarketplaceS = new ethers.Contract(sepoliaNftMarketplaceAddress.address, nftMarketplaceAbi.abi, signer)
      setNftMarketplaceSepolia(nftMarketplaceS)
      const marketplaceS = new ethers.Contract(sepoliaMarketplaceAddress.address, marketplaceAbi.abi, signer)
      setMarketplaceSepolia(marketplaceS)
      const nftAuctionS = new ethers.Contract(sepoliaNftAuctionAddress.address, nftAuctionAbi.abi, signer)
      setNftAuctionSepolia(nftAuctionS)
      const auctionS = new ethers.Contract(sepoliaAuctionAddress.address, auctionAbi.abi, signer)
      setAuctionSepolia(auctionS)
      // hardhat
      const nftMarketplaceH = new ethers.Contract(hardhatNftMarketplaceAddress.address, nftMarketplaceAbi.abi, signer)
      setNftMarketplaceHardhat(nftMarketplaceH)
      const marketplaceH = new ethers.Contract(hardhatMarketplaceAddress.address, marketplaceAbi.abi, signer)
      setMarketplaceHardhat(marketplaceH)
      const nftAuctionH = new ethers.Contract(hardhatNftAuctionAddress.address, nftAuctionAbi.abi, signer)
      setNftAuctionHardhat(nftAuctionH)
      const auctionH = new ethers.Contract(hardhatAuctionAddress.address, auctionAbi.abi, signer)
      setAuctionHardhat(auctionH)
    }
    else {
      toast.error(`Please install Metamask`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  useEffect(() => {
    loadContracts()
  }, []);

  return (
    <div className="App">
      <ContextState>
        <BrowserRouter>
          <Navbar connectWallet={connectWallet} account={account} /><br /><br />
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
          <Routes>

            <Route path="/auction/*" element={<ErrorPage />} />
            <Route path="/completedauction/*" element={<ErrorPage />} />
            <Route path="/collection/*" element={<ErrorPage />} />
            <Route path="/mycollection/*" element={<ErrorPage />} />

            <Route path='/auction/:network/:tokenid' element={<CompletedAuction />} />

            <Route path='/collection/:name' element={<CollectionModal account={account} nftMarketplaceGoerli={nftMarketplaceGoerli} marketplaceGoerli={marketplaceGoerli} nftMarketplaceMumbai={nftMarketplaceMumbai} marketplaceMumbai={marketplaceMumbai} nftMarketplaceSepolia={nftMarketplaceSepolia} marketplaceSepolia={marketplaceSepolia} nftMarketplaceHardhat={nftMarketplaceHardhat} marketplaceHardhat={marketplaceHardhat} networkName={networkName} />} />

            <Route path='/mycollection/:name' element={<OwnCollectionModal nftMarketplaceGoerli={nftMarketplaceGoerli} marketplaceGoerli={marketplaceGoerli} nftMarketplaceMumbai={nftMarketplaceMumbai} marketplaceMumbai={marketplaceMumbai} nftMarketplaceSepolia={nftMarketplaceSepolia} marketplaceSepolia={marketplaceSepolia} nftMarketplaceHardhat={nftMarketplaceHardhat} marketplaceHardhat={marketplaceHardhat} account={account} networkName={networkName} />} />

            <Route path='/:name/:network/:tokenid' element={<MarketplaceModal />} />

            <Route path='/' element={<Home nftMarketplaceGoerli={nftMarketplaceGoerli} marketplaceGoerli={marketplaceGoerli} nftMarketplaceMumbai={nftMarketplaceMumbai} marketplaceMumbai={marketplaceMumbai} nftMarketplaceSepolia={nftMarketplaceSepolia} marketplaceSepolia={marketplaceSepolia} nftMarketplaceHardhat={nftMarketplaceHardhat} marketplaceHardhat={marketplaceHardhat} account={account} networkName={networkName} />} />

            <Route path='/auctions' element={<Auctions nftAuctionGoerli={nftAuctionGoerli} auctionGoerli={auctionGoerli} nftAuctionMumbai={nftAuctionMumbai} auctionMumbai={auctionMumbai} nftAuctionSepolia={nftAuctionSepolia} auctionSepolia={auctionSepolia} nftAuctionHardhat={nftAuctionHardhat} auctionHardhat={auctionHardhat} account={account} networkName={networkName} />} />

            <Route path='/private' element={<Private nftMarketplaceGoerli={nftMarketplaceGoerli} marketplaceGoerli={marketplaceGoerli} nftMarketplaceMumbai={nftMarketplaceMumbai} marketplaceMumbai={marketplaceMumbai} nftMarketplaceSepolia={nftMarketplaceSepolia} marketplaceSepolia={marketplaceSepolia} nftMarketplaceHardhat={nftMarketplaceHardhat} marketplaceHardhat={marketplaceHardhat} account={account} networkName={networkName} />} />
            <Route path='/guide' element={<Guide />} />

            <Route path='/mycollection' element={<Collections account={account} networkName={networkName} setAccount={setAccount} />} />

            <Route path='/createCollection' element={<CreateCollection account={account} networkName={networkName} />} />

            <Route path='/mycart' element={<Mycart account={account} networkName={networkName} />} />
            <Route path='/auctionitems' element={<AuctionItems account={account} networkName={networkName} />} />
            <Route path='/owneditems' element={<OwnedItems account={account} networkName={networkName} />} />

            <Route path='/createnft' element={<CreateNft nftMarketplaceGoerli={nftMarketplaceGoerli} marketplaceGoerli={marketplaceGoerli} nftMarketplaceMumbai={nftMarketplaceMumbai} marketplaceMumbai={marketplaceMumbai} nftMarketplaceSepolia={nftMarketplaceSepolia} marketplaceSepolia={marketplaceSepolia} nftMarketplaceHardhat={nftMarketplaceHardhat} marketplaceHardhat={marketplaceHardhat} nftAuctionGoerli={nftAuctionGoerli} auctionGoerli={auctionGoerli} nftAuctionMumbai={nftAuctionMumbai} auctionMumbai={auctionMumbai} nftAuctionSepolia={nftAuctionSepolia} auctionSepolia={auctionSepolia} nftAuctionHardhat={nftAuctionHardhat} auctionHardhat={auctionHardhat} account={account} networkName={networkName} />} />
          </Routes>
        </BrowserRouter>
      </ContextState>
    </div>
  );
}

export default App;
