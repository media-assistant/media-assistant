import "../styles/global.css";
import type { AppProps } from "next/app";
import Nav from "../components/Nav";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Nav />
    <Component {...pageProps} />
  </>
);

export default App;
