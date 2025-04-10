const Moralis = require("moralis").default;
require("dotenv").config();
const { ethers } = require("ethers");

const networkAddressess = require("./key/mappingKey.json");
const { Streams } = require("@moralisweb3/streams");
// const { abi } = require("web3/lib/commonjs/eth.exports");
let chainID = process.env.chainID;
const ContractAddress = networkAddressess[chainID]["NftMarketplace"][0];
const apiKey = process.env.moralisApiKey;
const moralisChainId = chainID == "31337" ? "0x539" : chainID;

// debug ...
console.log("apikey is :", apiKey);
console.log("chainID is: ", chainID);
console.log(typeof chainID, chainID)

async function main() {
  try {
    await Moralis.start({
      apiKey: apiKey,
    });

    await checkStreams();

    if (apiKey && apiKey.data && apiKey.data.networkType) {
      console.log(apiKey.data.networkType);
    } else {
      console.log("networkType is undefined or response is incorrect");
    }
    console.log("working witn contract Address:", ContractAddress);

    const itemListedSignature = "ItemListed(address,address,uint256,uint256)";
    const itemBoughtSignature = "ItemBought(address,address,uint256,uint256)";
    const ItemCanceledSignature = "ItemCanceled(address,address,uint256)";

    console.log("2nd Pass");
    const itemListedTopic0 = ethers.id(itemListedSignature);
    const itemBoughtTopic0 = ethers.id(itemBoughtSignature);
    const ItemCanceledTopic0 = ethers.id(ItemCanceledSignature);

    // console.event("ItemListed Topic0:", itemListedTopic0);
    // console.event("ItemBought Topic0:", itemBoughtTopic0);
    // console.event("ItemCanceled Topic0:", ItemCanceledTopic0);
    console.log("3rd Pass");

    const listedResponse = await Moralis.Streams.add({
      webhookUrl: "https://webhook.site/f86c9f43-9af7-4aee-ba8a-49f0faffe011",
      description: "Watch ItemListed events",
      tag: "ItemListed",
      networkType: "evm",
      chains: [moralisChainId],
      includeNativeTxs: true,
      topic0: [itemListedTopic0],
      abi: {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
        ],
        name: "ItemListed",
        type: "event",
      },
      triggers: [
        {
          type: "log",
          contractAddress: ContractAddress,
          functionAbi: {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "seller",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "nftAddress",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
            ],
            name: "ItemListed",
            type: "event",
          },
        },
      ],
    });

    const boughtResponse = await Moralis.Streams.add({
      webhookUrl: "https://webhook.site/f86c9f43-9af7-4aee-ba8a-49f0faffe011",
      description: "Watch ItemBought events",
      tag: "ItemBought",
      networkType: "evm",
      chains: [moralisChainId],
      includeNativeTxs: true,
      topic0: [itemBoughtTopic0],
      abi: {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
        ],
        name: "ItemBought",
        type: "event",
      },
      triggers: [
        {
          type: "log",
          contractAddress: ContractAddress,
          functionAbi: {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "buyer",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "nftAddress",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
            ],
            name: "ItemBought",
            type: "event",
          },
        },
      ],
    });

    const CancelledResponse = await Moralis.Streams.add({
      webhookUrl: "https://webhook.site/f86c9f43-9af7-4aee-ba8a-49f0faffe011",
      description: "Watch ItemCanceled events",
      tag: "ItemCanceled",
      networkType: "evm",
      chains: [moralisChainId],
      includeNativeTxs: true,
      topic0: [ItemCanceledTopic0],
      abi: {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ItemCanceled",
        type: "event",
      },
      triggers: [
        {
          type: "log",
          contractAddress: ContractAddress,
          functionAbi: {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "seller",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "nftAddress",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "ItemCanceled",
            type: "event",
          },
        },
      ],
    });

    if (
      listedResponse.success &&
      boughtResponse.success &&
      CancelledResponse.success
    ) {
      console.log("Success! Database Updated");
    } else {
      console.log("Somthing! Went Wrong ...");
    }
  } catch (error) {
    console.log("Error occurred:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.event(error);
    process.exit(1);
  });
  let streams;  

  async function init() {
    streams = new Streams({
      apiKey: apiKey
    });
    console.log("Streams Object:", streams);
  }
  async function checkStreams() {
    try {
      const allStreams = await streams.getAll();
      console.log("All Streams Response:", allStreams);  // Poora response log karo
  
      if (allStreams && allStreams.networkType) {
        console.log("Network Type:", allStreams.networkType);
      } else {
        console.log("networkType missing hai ya response ka structure alag hai.");
      }
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  }
    
  
  (async function() {
    await init();   
    await checkStreams();  
  })();
  