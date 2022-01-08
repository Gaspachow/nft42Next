import { AppProps } from 'next/dist/next-server/lib/router/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Web3ReactProvider } from '@web3-react/core';
import Head from 'next/head';
import { Web3Provider } from '@ethersproject/providers';

//import { CUSTOM_SIZES, pxToRem } from '../themes';
//import { Box, Button, Container, Flex, useThemeUI } from 'theme-ui';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App({ Component, pageProps }: AppProps) {
  return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
  );
}

export default App;
