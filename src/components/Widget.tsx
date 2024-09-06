import { TokenInfo } from '@uniswap/token-lists'
import FBTC20ICON from 'assets/images/FBTC.png'
import FETHICON from 'assets/svg/FETH.svg'
import USDTICON from 'assets/svg/USDT.svg'
import WETHICON from 'assets/svg/WETH.png'
import { DialogWidgetProps, Provider as DialogProvider } from 'components/Dialog'
import ErrorBoundary, { OnError } from 'components/Error/ErrorBoundary'
import { SupportedLocale } from 'constants/locales'
import { TransactionEventHandlers, TransactionsUpdater } from 'hooks/transactions'
import { Provider as BlockNumberProvider } from 'hooks/useBlockNumber'
import { Flags, useInitialFlags } from 'hooks/useSyncFlags'
import useSyncWidgetEventHandlers, { WidgetEventHandlers } from 'hooks/useSyncWidgetEventHandlers'
import { Provider as TokenListProvider } from 'hooks/useTokenList'
import { Provider as Web3Provider, ProviderProps as Web3Props } from 'hooks/web3'
import { Provider as I18nProvider } from 'i18n'
import { Provider as AtomProvider } from 'jotai'
import { PropsWithChildren, StrictMode, useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from 'state'
import { MulticallUpdater } from 'state/multicall'
import styled from 'styled-components/macro'
import { Provider as ThemeProvider, Theme } from 'theme'

import { SupportedChainId } from '../constants/chains'
import { FBTC20_BLAST_SEPOLIA, FBTC25_BLAST_SEPOLIA, WETH_BLAST_SEPOLIA, FETH_BLAST_SEPOLIA, USDT_BLAST_SEPOLIA, WBTC_BLAST_SEPOLIA } from '../constants/tokens'
import WidgetWrapper from './WidgetWrapper'

export const DialogWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.large}rem;
  height: 100%;
  left: 0;
  padding: 0.5rem;
  position: absolute;
  top: 0;
  width: 100%;
`

export interface WidgetProps
  extends Flags,
    TransactionEventHandlers,
    Web3Props,
    WidgetEventHandlers,
    DialogWidgetProps {
  theme?: Theme
  locale?: SupportedLocale
  tokenList?: string | TokenInfo[]
  width?: string | number
  className?: string
  onError?: OnError
}
/*
tokenList: string | TokenInfo[]; // Token list to use for token selection.
[
  {
    "chainId": SupportedChainId.BLAST_SEPOLIA,
    "address":
    "symbol": "DAI",
    "name": "Dai Stablecoin",
    "decimals": 18,
    "logoURI": "https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png"
  }
]

* */
const blast_sepolia: TokenInfo[] = [
  {
    chainId: SupportedChainId.BLAST_SEPOLIA,
    address: WBTC_BLAST_SEPOLIA.address,
    symbol: WBTC_BLAST_SEPOLIA.symbol as string,
    name: WBTC_BLAST_SEPOLIA.name as string,
    decimals: WBTC_BLAST_SEPOLIA.decimals,
    logoURI:
      'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
  {
    chainId: SupportedChainId.BLAST_SEPOLIA,
    address: FBTC20_BLAST_SEPOLIA.address,
    symbol: FBTC20_BLAST_SEPOLIA.symbol as string,
    name: FBTC20_BLAST_SEPOLIA.name as string,
    decimals: FBTC20_BLAST_SEPOLIA.decimals,
    logoURI: FBTC20ICON,
  },
  {
    chainId: SupportedChainId.BLAST_SEPOLIA,
    address: FBTC25_BLAST_SEPOLIA.address,
    symbol: FBTC25_BLAST_SEPOLIA.symbol as string,
    name: FBTC25_BLAST_SEPOLIA.name as string,
    decimals: FBTC25_BLAST_SEPOLIA.decimals,
    logoURI: FBTC20ICON,
  },
  {
    chainId: SupportedChainId.BLAST_SEPOLIA,
    address: USDT_BLAST_SEPOLIA.address,
    symbol: USDT_BLAST_SEPOLIA.symbol as string,
    name: USDT_BLAST_SEPOLIA.name as string,
    decimals: USDT_BLAST_SEPOLIA.decimals,
    logoURI: USDTICON,
  },
  {
    chainId: SupportedChainId.BLAST_SEPOLIA,
    address: FETH_BLAST_SEPOLIA.address,
    symbol: FETH_BLAST_SEPOLIA.symbol as string,
    name: FETH_BLAST_SEPOLIA.name as string,
    decimals: FETH_BLAST_SEPOLIA.decimals,
    logoURI: FETHICON,
  },
  {
    chainId: SupportedChainId.BLAST_SEPOLIA,
    address: WETH_BLAST_SEPOLIA.address,
    symbol: WETH_BLAST_SEPOLIA.symbol as string,
    name: WETH_BLAST_SEPOLIA.name as string,
    decimals: WETH_BLAST_SEPOLIA.decimals,
    logoURI: WETHICON,
  }
  // {
  //   chainId: SupportedChainId.BLAST_SEPOLIA,
  //   address: USDC_BLAST_SEPOLIA.address,
  //   symbol: USDC_BLAST_SEPOLIA.symbol as string,
  //   name: USDC_BLAST_SEPOLIA.name as string,
  //   decimals: USDC_BLAST_SEPOLIA.decimals,
  //   logoURI:
  //     'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  // },
  // {
  //   chainId: SupportedChainId.BLAST_SEPOLIA,
  //   address: USDT_BLAST_SEPOLIA.address,
  //   symbol: USDT_BLAST_SEPOLIA.symbol as string,
  //   name: USDT_BLAST_SEPOLIA.name as string,
  //   decimals: USDT_BLAST_SEPOLIA.decimals,
  //   logoURI:
  //     'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  // },
]
export default function Widget(props: PropsWithChildren<WidgetProps>) {
  const [dialog, setDialog] = useState<HTMLDivElement | null>(props.dialog || null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      window.parent.postMessage({
        id: "mappingfunk-uniswap-widgets",
        iframeHeight: Math.min(document.body.offsetHeight, document.body.scrollHeight),
        iframeSrc: window.location.href
      }, '*');
    }); resizeObserver.observe(document.body);
  }, [])
  return (
    <StrictMode>
      <ThemeProvider theme={props.theme}>
        <WidgetWrapper width={props.width} className={props.className}>
          <I18nProvider locale={props.locale}>
            <DialogWrapper ref={setDialog} />
            <DialogProvider value={props.dialog || dialog} options={props.dialogOptions}>
              <ErrorBoundary onError={props.onError}>
                <ReduxProvider store={store}>
                  {
                    // UI configuration must be passed to initial atom values, or the first frame will render incorrectly.
                  }
                  <AtomProvider initialValues={useInitialFlags(props as Flags)}>
                    <WidgetUpdater {...props} />
                    <Web3Provider {...(props as Web3Props)}>
                      <BlockNumberProvider>
                        <MulticallUpdater />
                        <TransactionsUpdater {...(props as TransactionEventHandlers)} />
                        <TokenListProvider list={blast_sepolia}>{props.children}</TokenListProvider>
                      </BlockNumberProvider>
                    </Web3Provider>
                  </AtomProvider>
                </ReduxProvider>
              </ErrorBoundary>
            </DialogProvider>
          </I18nProvider>
        </WidgetWrapper>
      </ThemeProvider>
    </StrictMode>
  )
}

/** A component in the scope of AtomProvider to set Widget-scoped state. */
function WidgetUpdater(props: WidgetProps) {
  useSyncWidgetEventHandlers(props as WidgetEventHandlers)
  return null
}
