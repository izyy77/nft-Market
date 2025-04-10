import clientPromise from "../../../constant/mongoDB";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("nftMarketPlace");
    const collection = db.collection("activeItem");
    const item =  await collection.find({}).toArray();
    console.log("📦 Found items from DB:", item);
    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Error Found Resolve It ..." }),
      { status: 405 }
    );
  }
}
