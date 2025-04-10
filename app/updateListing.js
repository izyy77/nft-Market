"use client";
import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftAbi from "../key/nft.json";
import Image from "next/image";
import { ethers } from "ethers";
import updateListingModal from "./02_updateListingModal";
import { Card } from "web3uikit";
export default function UpdateListing({
  marketplaceAddress,
  nftAddress,
  price,
  seller,
  tokenId,
}) {
  const { account } = useMoralis();
  const [imageUri, setImageUri] = useState("");
  const [accounts, setAccount] = useState("");
  const { tokenName, setTokenName } = useState("");
  const { tokenDescription, setTokenDescription } = useState("");
  const { showModal, setShowModal } = useState(false);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          console.log("🔌 Metamask detected");

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const accountAddress = await signer.getAddress();
          console.log("🙋 Account connected:", accountAddress);
          setAccount(accountAddress);

          const nftContract = new ethers.Contract(nftAddress, nftAbi, provider);
          const tokenURI = await nftContract.tokenURI(tokenId);
          console.log("🎯 Token URI:", tokenURI);

          if (tokenURI) {
            const metadataURL = tokenURI.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            );
            const response = await fetch(metadataURL);
            const metadata = await response.json();
            const image = metadata.image.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            );
            setTokenName(response.name);
            setTokenDescription(response.description);
            console.log("🖼️ Final Image URL:", image);
            setImageUri(image);
          }
        } else {
          console.log("🦊 Metamask not detected.");
        }
      } catch (error) {
        console.error("🚨 Error fetching token image:", error);
      }
    };

    fetchImage();
  }, []);

  const ownedBy = seller === account || seller === undefined;
  const ReOwnedBy = ownedBy ? "You" : seller;

  const handleCardClick = () => {
    ownedBy ? setShowModal(true) : "let's Buy Nft";
  };

  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {imageUri ? (
        <div>
          <updateListingModal
            isVisible={showModal}
            tokenId={tokenId}
            nftAddress={nftAddress}
            marketPlaceAddress={marketplaceAddress}
            onClose={hideModal}
          ></updateListingModal>
          <Card
            onClick={handleCardClick}
            title={tokenName}
            description={tokenDescription}
          >
            <div> #{tokenId}</div>
            <div className=" italic text-sm">
              marketplaceAddress:{marketplaceAddress}
            </div>
            <div> Nft-Address:{nftAddress}</div>
            <Image
              loader={() => imageUri}
              src={imageUri}
              height={185}
              width={185}
            ></Image>
            <div className="italic text-sm"> Owned By{ReOwnedBy}</div>
            <div className="italic text-sm"> Price:{price}</div>
          </Card>
        </div>
      ) : (
        <div> Loading ...</div>
      )}
    </div>
  );
}
