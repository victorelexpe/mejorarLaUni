import Router from "next/router";
import withAnalytics from "next-analytics";
import Home from "./index"

function MyApp({ Component, pageProps }) {
    return (
        <Component {...pageProps}>
            <Home {...pageProps}/>
        </Component>
    )
}
  
export default withAnalytics(Router, { ga: "UA-163901123-1" })(MyApp);
