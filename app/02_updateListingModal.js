import { ethers } from "ethers";
import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import nftMarketAbi from "../key/NFTMarketPlace.json";

export default async function updateListingModal({
  nftAddress,
  tokenId,
  marketplaceAddress,
  isVisible,
  onClose,
}) {
  if (typeof window.ethereum !== "undefined") {
    const { accounts, setAccounts } = useState("");
    const { priceToUpdateListing, setPriceToUpdateListing } = useState(0);
    const provider = await ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const accountAddress = await signer.getAddress();
    setAccounts(accountAddress);

    const nfMarketPlace = await ethers.Contract(
      marketplaceAddress,
      nftMarketAbi,
      provider
    );
    const updateListings = await nfMarketPlace.updateListing(
      nftAddress,
      tokenId,
      (newPrice = priceToUpdateListing)
    );
  }

  const dispatch = useNotification;
  const handleUpdateListingSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "Success",
      message: "Listing Updated",
      tittle: "Listing updated -please refreash (and move block )",
      position: "topR",
    });
    setPriceToUpdateListing("0")
  };

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() =>
        updateListings({
          onError: (error) => {
            console.log(error);
          },
          onSuccess: handleUpdateListingSuccess,
        })
      }
    >
      <Input
        label="update Listing"
        type="number"
        name="NFT MarketPlace"
        onChange={(event) => {
          setPriceToUpdateListing(event.target.value);
        }}
      ></Input>
    </Modal>
  );
}
