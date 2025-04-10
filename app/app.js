import { MoralisProvider } from "@moralisweb3/react"
function myApp({component, pageProps}){
    return (
        <MoralisProvider initializeOnMount={false}> 
        <component {...pageProps}/>
        </MoralisProvider>
    )
}

export default myApp