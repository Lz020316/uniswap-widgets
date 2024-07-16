import { tokens } from '@uniswap/default-token-list'
import { TokenInfo } from '@uniswap/token-lists'
import {
  darkTheme,
  defaultTheme,
  DialogAnimationType,
  lightTheme,
  SupportedChainId,
  SwapWidget,
} from '@uniswap/widgets'
import Row from 'components/Row'
import { CHAIN_NAMES_TO_IDS } from 'constants/chains'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useValue } from 'react-cosmos/fixture'

import { DAI, USDC_MAINNET } from '../constants/tokens'
import EventFeed, { Event, HANDLERS } from './EventFeed'
import useOption from './useOption'
import useProvider from './useProvider'

const TOKEN_WITH_NO_LOGO = {
  chainId: 1,
  decimals: 18,
  symbol: 'HDRN',
  name: 'Hedron',
  address: '0x3819f64f282bf135d62168C1e513280dAF905e06',
}

const mainnetTokens = tokens.filter((token) => token.chainId === SupportedChainId.MAINNET)
const tokenLists: Record<string, TokenInfo[] | string> = {
  Default: tokens,
  Extended: 'https://extendedtokens.uniswap.org/',
  'Mainnet only': mainnetTokens,
  Logoless: [TOKEN_WITH_NO_LOGO],
}

function Fixture() {
  const [events, setEvents] = useState<Event[]>([])
  const useHandleEvent = useCallback(
    (name: string) =>
      (...data: unknown[]) =>
        setEvents((events) => [{ name, data }, ...events]),
    []
  )

  const [convenienceFee] = useValue('convenienceFee', { defaultValue: 0 })
  const convenienceFeeRecipient = useOption('convenienceFeeRecipient', {
    options: [
      '0x1D9Cd50Dde9C19073B81303b3d930444d11552f7',
      '0x0dA5533d5a9aA08c1792Ef2B6a7444E149cCB0AD',
      '0xE6abE059E5e929fd17bef158902E73f0FEaCD68c',
    ],
  })

  // TODO(zzmp): Changing defaults has no effect if done after the first render.
  const currencies: Record<string, string> = {
    Native: 'NATIVE',
    DAI: DAI.address,
    USDC: USDC_MAINNET.address,
  }
  const defaultInputToken = useOption('defaultInputToken', { options: currencies, defaultValue: 'F(BTC,20)' })
  const [defaultInputAmount] = useValue('defaultInputAmount', { defaultValue: 0 })
  const defaultOutputToken = useOption('defaultOutputToken', { options: currencies })
  const [defaultOutputAmount] = useValue('defaultOutputAmount', { defaultValue: 0 })

  const [brandedFooter] = useValue('brandedFooter', { defaultValue: true })
  const [hideConnectionUI] = useValue('hideConnectionUI', { defaultValue: false })
  const [pageCentered] = useValue('pageCentered', { defaultValue: false })

  const [width] = useValue('width', { defaultValue: 682 })

  const [theme, setTheme] = useValue('theme', { defaultValue: defaultTheme })
  const [darkMode] = useValue('darkMode', { defaultValue: false })
  useEffect(() => setTheme((theme) => ({ ...theme, ...(darkMode ? darkTheme : lightTheme) })), [darkMode, setTheme])

  const defaultNetwork = useOption('defaultChainId', {
    options: Object.keys(CHAIN_NAMES_TO_IDS),
    defaultValue: 'blast-sepolia',
  })
  const defaultChainId = defaultNetwork ? CHAIN_NAMES_TO_IDS[defaultNetwork] : undefined

  const connector = useProvider(SupportedChainId.BLAST_SEPOLIA)

  const tokenList = useOption('tokenList', { options: tokenLists, defaultValue: 'Default', nullable: false })

  const [routerUrl] = useValue('routerUrl', { defaultValue: 'https://api.uniswap.org/v1/' })

  const dialogAnimation = useOption('dialogAnimation', {
    defaultValue: DialogAnimationType.FADE,
    options: [DialogAnimationType.SLIDE, DialogAnimationType.FADE, DialogAnimationType.NONE],
  })

  const eventHandlers = useMemo(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => HANDLERS.reduce((handlers, name) => ({ ...handlers, [name]: useHandleEvent(name) }), {}),
    [useHandleEvent]
  )

  const widget = (
    <SwapWidget
      convenienceFee={convenienceFee}
      convenienceFeeRecipient={convenienceFeeRecipient}
      // defaultInputTokenAddress={defaultInputToken}
      defaultInputAmount={defaultInputAmount}
      defaultOutputTokenAddress={"0x982Ebde77c10B7155A73d59c0437aC556F7F7b01"}
      defaultOutputAmount={defaultOutputAmount}
      hideConnectionUI={hideConnectionUI}
      defaultChainId={defaultChainId}
      provider={connector}
      theme={{
        container:"rgba(244, 246, 254, 1)",
        module:"rgba(222, 241, 255, 1)",
        primary:"rgba(97, 102, 119, 1)",
        secondary:"rgba(0, 0, 0, 0.64)",
        interactive:"rgba(110, 214, 243, 1)",
        accent: "rgba(110, 214, 243, 1)"
      }}
      defaultInputTokenAddress={"0x684063aB93Aa493F8a1389cD2Fbc5E9fBd324A91"}
      tokenList={tokenList}
      width={width}
      // routerUrl={routerUrl}
      brandedFooter={brandedFooter}
      dialogOptions={{
        animationType: dialogAnimation,
        pageCentered,
      }}
      {...eventHandlers}
    />
  )

  // If framed in a different origin, only display the SwapWidget, without any chrome.
  // This is done to faciliate iframing in the documentation (https://docs.uniswap.org).
  // if (!window.frameElement) return widget

  return (
    <Row flex align="start" justify="start" gap={0.5}>
      {widget}
    </Row>
  )
}

export default <Fixture />
