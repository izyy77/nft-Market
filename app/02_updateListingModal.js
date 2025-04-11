"use client";
import { ethers } from "ethers";
import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import nftMarketAbi from "../key/NFTMarketPlace.json";
export default function UpdateListingModal({
  nftAddress,
  tokenId,
  marketplaceAddress,
  isVisible,
  onClose,
}) {
  const [accounts, setAccounts] = useState("");
  const [priceToUpdateListing, setPriceToUpdateListing] = useState(0);
  const toast = useToast();
  const handleSuccess = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = await ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccounts(accountAddress);
     
        const nfMarketPlace = await ethers.Contract(marketplaceAddress, nftMarketAbi, signer);
        const tx = await nfMarketPlace.updateListing(
          nftAddress,
          tokenId,
          (newPrice = priceToUpdateListing),
        );
        await tx.wait(1);

        toast({
          title: "Listing updated.",
          description: "Your listing price was updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        setPriceToUpdateListing("");
        onClose();
      }
    } 
     catch (error) {
      console.error("❌ Update listing failed:", error);
      toast({
        title: "Error updating listing",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
     }
  }
    return (
      <Modal isOpen={isVisible} onClose={onclose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Listing </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input 
            placeHolder={"New Price inERG"}
            type="number"
            value={priceToUpdateListing}
            onChange={(event) => {
              setPriceToUpdateListing(event.target.value);
            }}
            />
          </ModalBody>
          <Button colorScheme="blue" onClick={handleSuccess} > Update Listing </Button>
        </ModalContent>
      </Modal>
    );
  };
