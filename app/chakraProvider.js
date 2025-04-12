"use client"
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const emotionCache = createCache({
    key:"chakra",
    prepend: true
})

export function ChakraClientProvider({ children }) {
    return (
      <CacheProvider value={emotionCache}>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </CacheProvider>
    );
  }