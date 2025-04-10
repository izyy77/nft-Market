import { ethers } from "ethers";
import { useEffect, useState } from "react";
import UpdateListing from "./updateListing";
export default function Homeez() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const FetchActive = async () => {
      try {
        const res = await fetch("/api/getActiveItems");
        const data = await res.json();
        console.log("Received data:", data);
        setItems(data);
        console.log("🎯 Received from API:", data);
      } catch (error) {
        console.log("❌error found:", error);
      }
    };
    FetchActive();
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Active Listings</h1>
      {items.length === 0 ? (
        <p>No items listed currently.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, idx) => (
            <li key={idx} className="p-4 border rounded shadow"> 
            <UpdateListing
            marketplaceAddress={item.marketplaceAddress} price={item.price} nftAddress={item.nftAddress} seller={item.seller} tokenId={item.tokenId}  />
          </li>
          ))}
        </ul>
      )}
    </div>
  );
}
