"use client";
import { useState, useEffect } from "react";
import nftAbi from "../key/nft.json";
import { Link, useToast } from "@chakra-ui/react";
import Image from "next/image";
import { ethers } from "ethers";
import UpdateListingModal from "./02_updateListingModal";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
  Divider,
  Button,
  Image as ChakraImage,
} from "@chakra-ui/react";
import NftMarketAbi from "../key/NFTMarketPlace.json";

export default function UpdateListing({ marketplaceAddress, nftAddress, price, seller, tokenId }) {
  const [imageUri, setImageUri] = useState("");
  const [account, setAccount] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (!window.ethereum) return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        // const signer = await provider.getSigner();
        // const accountAddress = await signer.getAddress();
        // setAccount(accountAddress);
        const nftContract = new ethers.Contract(nftAddress, nftAbi, provider);
        const tokenURI = await nftContract.tokenURI(tokenId);

        if (tokenURI) {
          const metadataURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
          const response = await (await fetch(metadataURL)).json();
          // const metadata = await response.json();
          const image = response.image.replace("ipfs://", "https://ipfs.io/ipfs/");
          setTokenName(response.name);
          setTokenDescription(response.description);
          setImageUri(image);
          console.log("🖼️imageURI:", image);
        }
      } catch (error) {
        console.error("🚨 Error fetching token image:", error);
      }
    };

    fetchImage();
  }, []);
  const buyItem = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        const NftMarket = new ethers.Contract(marketplaceAddress, NftMarketAbi, signer);
        const valueInWei = BigInt(price);
        const buyNft = await NftMarket.buyItem(nftAddress, tokenId, { value: valueInWei, gasLimit: 300000 });
        await buyNft.wait();
      }
    } catch (error) {
      console.log(" ♦ Error ", error);
    }
  };
  const ownedBy = seller === account || seller === undefined;
  const ReOwnedBy = ownedBy ? "You" : seller;

  const handleCardClick = () => {
    ownedBy ? setShowModal(true) : buyItem();
  };

  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {imageUri ? (
        <div>
          <UpdateListingModal
            isVisible={showModal}
            tokenId={tokenId}
            nftAddress={nftAddress}
            marketPlaceAddress={marketplaceAddress}
            onClose={hideModal}
          />
          <Card
            maxW="xs"
            maxH="500px"
            width={"-webkit-fit-content"}
            borderRadius="xl"
            overflow="auto"
            boxShadow="md"
            transition="all 0.3s"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)", cursor: "pointer" }}
            // onClick={handleCardClick}
          >
            <CardBody>
              <Stack spacing="1">
                <Heading size="md">{tokenName}</Heading>
                <Text color="gray.600" fontSize="sm">
                  {tokenDescription}
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  Token ID: #{tokenId}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  NFT Address: {nftAddress.slice(0, 6)}...{nftAddress.slice(-4)}
                </Text>
                <Text className="italis tex-sm" fontSize={"xs"}>
                  NFT Address:
                  <Link
                    href={`https://sepolia.etherscan.io/address/${nftAddress}`}
                    isExternal
                    color="blue.400"
                    fontWeight="bold"
                  ></Link>
                </Text>
                <ChakraImage
                  src={imageUri}
                  alt={tokenName}
                  borderTopRadius="xl"
                  objectFit="cover"
                  h="150"
                  w="50%"
                />
                <Text fontSize="sm" color="gray.500">
                  Owner: {ReOwnedBy.slice(0, 6)}...{ReOwnedBy.slice(-4)}
                </Text>
                <Text fontWeight="bold" color="green.400">
                  Price: {price} WEI
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                colorScheme="blue"
                w="full"
                onClick={(e) => {
                  e.stopPropagation(), ownedBy ? showModal(true) : buyItem();
                }}
              >
                {ownedBy ? "Update Listing" : "Buy Nft"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}
