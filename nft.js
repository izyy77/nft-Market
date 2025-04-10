import Moralis from "moralis";
import dotenv from "dotenv"
dotenv.config()
const api = process.env.NEXT_PUBLIC_MORALIS_API;

try {
  await Moralis.start({
    apiKey: api
  });

  const response = await Moralis.EvmApi.nft.getContractNFTs({
    "chain": "0xaa36a7",
    "format": "decimal",
    "address": "0xa54a118e2856a6bd64a03683510c39c67faf7a9c"
  });

  console.log(response.raw);
} catch (e) {
  console.error(e);
}
    
