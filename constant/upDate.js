import Moralis from "moralis"
require("dotenv").config()
const ApiKey = process.env.NEXT_PUBLIC_APIKEY;

async function initMoralis(){
    await Moralis.start({apiKey: ApiKey })
}
initMoralis()