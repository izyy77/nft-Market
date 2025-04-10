import { NextResponse } from "next/server";
import Moralis from "moralis";
import { MongoClient } from "mongodb";

// MongoDB URI from environment variables
const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const moralisApiKey = process.env.moralisApiKey;

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();

    // Start Moralis if not already started
    if (!Moralis.Core.isStarted) {
      await Moralis.start({ apiKey: moralisApiKey });
    }

    // Extract relevant fields from body
    const { confirmed, logs } = body;

    // Check if the transaction is confirmed
    if (!confirmed) {
      return NextResponse.json(
        { message: "Transaction not confirmed yet." },
        { status: 200 }
      );
    }

    const topic0 = logs?.[0]?.topic0?.toLowerCase();
    let eventName = "";

    // Check for known event names
    if (
      topic0 ===
      "0xd547e933094f12a9159076970143ebe73234e64480317844b0dcb36117116de4"
    ) {
      eventName = "ItemListed";
    } else if (
      topic0 ===
      "0x3e273e37e7e1a66fb0d505382fe54c3829d49f9852c0cb0f2715876a9c1c1c29"
    ) {
      eventName = "ItemBought";
    } else if (
      topic0 ===
      "0x7c7a9d47f109a65b36bdb60df5d0f285389b96ffdbf6d432f49bcd8367736e0f"
    ) {
      eventName = "ItemCanceled";
    } else {
      return NextResponse.json(
        { message: "Unknown event type." },
        { status: 200 }
      );
    }

    const nftAddress = "0x" + logs[0].topic2.slice(26);
    const tokenId = parseInt(logs[0].topic3, 16);
    const seller = "0x" + logs[0].topic1.slice(26);
    const price = parseInt(logs[0].data, 16);
    const address = logs[0].address;

    // Connect to MongoDB
    const client = await MongoClient.connect(uri);
    const db = client.db("nftMarketPlace");
    const collection = db.collection("activeItem");

    const query = { tokenId, nftAddress };
    const activeItemKey = `activeItem_${nftAddress}_${tokenId}`;

    if (eventName === "ItemListed") {
      await collection.deleteOne(query);
      await collection.updateOne(
        { key: activeItemKey }, 
        {
          $set: { 
            marketplaceAddress: address,
            nftAddress,
            price,
            tokenId,
            seller,
            listedDate: new Date(),
          },
        },
        { upsert: true } // This ensures the document is inserted if it doesn't exist
      );
      console.log("✅ Item listed successfully saved to MongoDB");
    } else if (eventName === "ItemCanceled" || eventName === "ItemBought") {
      // Remove item from collection if it was canceled or bought
      await collection.deleteOne({ key: activeItemKey });
      console.log(`🚀 Item removed from MongoDB: ${eventName}`);
    }

    // Return success response
    return NextResponse.json(
      { message: "Event processed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
