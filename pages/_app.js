import Router from "next/router";
import withAnalytics from "next-analytics";
import Index from "./index"
import Footer from '../components/footer'


import 'bootstrap/dist/css/bootstrap.css'

function MyApp({ Component, pageProps }) {

    return (
        <>
            <Component {...pageProps}>
                <Index {...pageProps}/>
            </Component>
            <Footer />

            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js" integrity="sha384-q2kxQ16AaE6UbzuKqyBE9/u/KzioAlnx2maXQHiDX9d4/zp8Ok3f+M7DPm+Ib6IU" crossOrigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.min.js" integrity="sha384-pQQkAEnwaBkjpqZ8RU1fF1AKtTcHJwFl3pblpTlHXybJjHpMYo79HY3hIi4NKxyj" crossOrigin="anonymous"></script>
        </>
    )
}
  
export default withAnalytics(Router, { ga: "UA-163901123-1" })(MyApp);