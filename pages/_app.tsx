import "@/styles/global.css";
import type { AppProps } from "next/app";
import BottomNav from "@/components/Nav";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <BottomNav />
    <Component {...pageProps} />
  </>
);

export default App;
