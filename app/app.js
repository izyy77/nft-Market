import { MoralisProvider } from "react-moralis"

function myApp({component, pageProps}){
    return (
        <MoralisProvider initializeOnMount={false}> 
        <component {...pageProps}/>
        </MoralisProvider>
    )
}

export default myApp