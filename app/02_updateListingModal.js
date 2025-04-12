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
  const [priceToUpdateListing, setPriceToUpdateListing] = useState("");
  const toast = useToast();

  const handleSuccess = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const nfMarketPlace = new ethers.Contract(marketplaceAddress, nftMarketAbi, signer);
        const tx = await nfMarketPlace.updateListing(
          nftAddress,
          tokenId,
          ethers.parseEther(priceToUpdateListing)
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
    } catch (error) {
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
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Listing</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="New Price in ETH"
            type="number"
            value={priceToUpdateListing}
            onChange={(e) => setPriceToUpdateListing(e.target.value)}
            mb={4}
          />
          <Button colorScheme="blue" width="100%" onClick={handleSuccess}>
            Update Listing
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
