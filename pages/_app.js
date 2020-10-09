import Router from "next/router";
import withAnalytics from "next-analytics";
import Home from "./index"
import Navbar from "../components/navbar"

function MyApp({ Component, pageProps }) {
    return (
        <Navbar>
            <Component {...pageProps}>
                <Home {...pageProps}/>
            </Component>
        </Navbar>
    )
}
  
export default withAnalytics(Router, { ga: "UA-163901123-1" })(MyApp);
