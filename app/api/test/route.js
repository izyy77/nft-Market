import { NextResponse } from "next/server";
import Moralis from "moralis";
import { MongoClient } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const moralisApiKey = process.env.moralisApiKey;


export async function POST(req) {
  try {
    console.log("📩 Received request from Moralis");
    const body = await req.json();
    console.log("📦 Request body:", JSON.stringify(body, null, 2));

    if (!Moralis.Core.isStarted) {
      await Moralis.start({ apiKey: moralisApiKey });
      console.log("🔑 Moralis started");
    }

    const { confirmed, logs } = body;

    if (!confirmed) {
      console.log("⏳ Transaction not confirmed yet.");
      return NextResponse.json({ message: "Transaction not confirmed yet." }, { status: 200 });
    }

    const topic0 = logs?.[0]?.topic0?.toLowerCase();

    let eventName = "";

    if (topic0 === "0xd547e933094f12a9159076970143ebe73234e64480317844b0dcb36117116de4") {
      eventName = "ItemListed";
    } else if (topic0 === "0x3e273e37e7e1a66fb0d505382fe54c3829d49f9852c0cb0f2715876a9c1c1c29") {
      eventName = "ItemBought";
    } else if (topic0 === "0x7c7a9d47f109a65b36bdb60df5d0f285389b96ffdbf6d432f49bcd8367736e0f") {
      eventName = "ItemCanceled";
    } else {
      console.log("❓ Unknown event type.");
      return NextResponse.json({ message: "Unknown event type." }, { status: 200 });
    }

    const nftAddress = "0x" + logs[0].topic2.slice(26);
    const tokenId = parseInt(logs[0].topic3, 16);
    const seller = "0x" + logs[0].topic1.slice(26);
    const price = parseInt(logs[0].data, 16);
    const address = logs[0].address;

    console.log("🔗 Connecting to MongoDB...");

    const client = await MongoClient.connect(uri);
    const db = client.db("nftMarketPlace");
    const collection = db.collection("activeItem");

    const query = { tokenId, nftAddress };
    const activeItemKey = `activeItem_${nftAddress}_${tokenId}`;

    if (eventName === "ItemListed") {
      await collection.deleteOne(query);
      await collection.updateOne({ key: activeItemKey }, {
        $set: {
          marketplaceAddress: address,
          nftAddress,
          price,
          tokenId,
          seller,
          listedDate: new Date(),
        }
      }, { upsert: true });
      console.log("✅ Item listed successfully saved to MongoDB");
    } else if (eventName === "ItemCanceled" || eventName === "ItemBought") {
      await collection.deleteOne({ key: activeItemKey });
      console.log(`🚀 Item removed from MongoDB: ${eventName}`);
    }

    return NextResponse.json({ message: "Event processed successfully." }, { status: 200 });

  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
export async function GET() {
  return NextResponse.json({ message: "GET request working fine!" }, { status: 200 });
}
