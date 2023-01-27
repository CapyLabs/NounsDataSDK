import '../styles/globals.css'

import {NounsDataWrapper} from "../context";
import type { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <NounsDataWrapper>
      <Component {...pageProps} ceramic />
    </NounsDataWrapper>
  );
}

export default MyApp