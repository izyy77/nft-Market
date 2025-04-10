"use client";
import { MoralisProvider } from "react-moralis"
import Head from "next/head";
import Homeez from "./nft";
import { NotificationProvider } from "web3uikit";
import WalletConnect from ".././connectButton"
export default function Home() {
  return (
    <div>
      <Head>
        <title>THE UNBEATEABLE MARKETPLACE</title>
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <Homeez/>
        <WalletConnect/>
      </MoralisProvider>
      hi from Next.js & it's Now ok again ok
    </div>
  );
}
