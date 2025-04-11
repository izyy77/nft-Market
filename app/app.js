import { MoralisProvider } from "@moralisweb3/react"
function myApp({Component, pageProps}){
    return (
        <MoralisProvider initializeOnMount={false}> 
        <Component {...pageProps}/>
        </MoralisProvider>
    )
}

export default myApp