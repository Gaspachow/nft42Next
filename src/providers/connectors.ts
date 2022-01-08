import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
  1: 'process.env.RPC_URL1' as string
}

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })


export const walletConnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true
})

export const walletLink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'nft42 bot',
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001]
})