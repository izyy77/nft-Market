import { MongoClient, ServerApiVersion } from "mongodb";
const ApiKey = process.env.NEXT_PUBLIC_APIKEY;
const uri = process.env.NEXT_PUBLIC_MONGODB_URI

const client =  new MongoClient(uri,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export default client;
