"use client";
import Homeez from "./nft";
import WalletConnect from "../connectButton";

export default function Home() {
  return (
        <div className="p-4">
          <Homeez />
          <WalletConnect />
          <p>hi from Next.js & it's Now ok again ok</p>
        </div>
  );
}
