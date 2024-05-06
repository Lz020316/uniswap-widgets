import { SupportedChainId } from 'constants/chains'
import { constructSameAddressMap } from 'utils/constructSameAddressMap'

type AddressMap = { [chainId: number]: string }

export const UNI_ADDRESS: AddressMap = constructSameAddressMap('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')

export const MULTICALL_ADDRESS: AddressMap = {
  ...constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984', [
    SupportedChainId.OPTIMISM_GOERLI,
    SupportedChainId.OPTIMISM,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON,
  ]),
  [SupportedChainId.ARBITRUM_ONE]: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',
  [SupportedChainId.ARBITRUM_RINKEBY]: '0xa501c031958F579dB7676fF1CE78AD305794d579',
  [SupportedChainId.CELO]: '0x633987602DE5C4F337e3DbF265303A1080324204',
  [SupportedChainId.CELO_ALFAJORES]: '0x633987602DE5C4F337e3DbF265303A1080324204',
  [SupportedChainId.BASE]: '0x091e99cb1C49331a94dD62755D168E941AbD0693',
  [SupportedChainId.BLAST_SEPOLIA]: '0xF6B7843BdC72534ad0eE374836001b352AcB0d9F',
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', [
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISM_GOERLI,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.POLYGON,
    SupportedChainId.POLYGON_MUMBAI,
  ]),
  [SupportedChainId.CELO]: '0x5615CDAb10dc425a742d643d949a7F474C01abc4',
  [SupportedChainId.CELO_ALFAJORES]: '0x5615CDAb10dc425a742d643d949a7F474C01abc4',
  [SupportedChainId.BASE]: '0x2626664c2603336E57B271c5C0b26F421741e481',
  [SupportedChainId.BLAST_SEPOLIA]: '0xcDf9136c2AB0DA6e556F28152A80a09e327fF9Cf',
  // [SupportedChainId.BLAST_SEPOLIA]: '0xc3be5FAc829B6A29A0f167A6B73ead38651F33E0',
}

export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.ROPSTEN]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.GOERLI]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.RINKEBY]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}
