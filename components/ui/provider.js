"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { MoralisProvider } from "@moralisweb3/react";
import { useState } from "react";

export function Provider({ children }) {

  return (
      <MoralisProvider initializeOnMount={false}>
        <ChakraProvider>{children}</ChakraProvider>
      </MoralisProvider>
  );
}
