"use client"
import { ChakraClientProvider } from "./chakraProvider";
import { Providers } from "../components/ui/provider"; // your Moralis or app-wide providers

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraClientProvider>
          <Providers>{children}</Providers>
        </ChakraClientProvider>
      </body>
    </html>
  );
}
