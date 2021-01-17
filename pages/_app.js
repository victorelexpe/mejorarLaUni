import Router from "next/router";
import withAnalytics from "next-analytics";
import Index from "./index"

import 'bootstrap/dist/css/bootstrap.css'

function MyApp({ Component, pageProps }) {

    return (
        <>
            <Component {...pageProps}>
                <Index {...pageProps}/>
            </Component>  
        </>
    )
}
  
export default withAnalytics(Router, { ga: "UA-163901123-1" })(MyApp);