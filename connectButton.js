"use client"
import { ethers } from "ethers";
import { useState } from "react";

export default function WalletConnect() {
  const [account, setAccount] = useState("");

  const connectBt = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } else {
      console.log("MetaMask Not Found!");
    }
  };

  return (
    <div>
      <button onClick={connectBt}>
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
      </button>
    </div>
  );
}
