import FantomLogo from '../assets/fantom.png'
import PolygonLogo from '../assets/polygon.webp'
import CeloLogo from '../assets/celo.png'
import AvaxLogo from '../assets/avax.png'
import MoonbeamLogo from '../assets/moonbeam.png'

export type CHainType = {
    chainId: string,
    rpc: string,
    chainName: string,
    contractResource: string,
    abiContractResource: string,
    contract: string,
    name: string,
    destinationContract: string,
    baseUri: string,
    icon: any,
    icon2?: any,
    type: 'source' | 'destination'
}

export const CHAINS: {
    fantom: CHainType,
    polygon: CHainType,
    celo: CHainType,
    moonbeam: CHainType,
} = {
    fantom: {
        name: 'Fantom GEMs',
        chainId: '0xfa2',
        rpc: 'https://rpc.ankr.com/fantom_testnet',
        chainName: '',
        contractResource: '',
        abiContractResource: '',
        contract: '0xB993e81240798e31FcE733f0A8791F204AedE669',
        baseUri: FantomLogo,
        destinationContract: '',
        type: 'source',
        icon: FantomLogo
    },
    polygon: {
        name: 'Polygon GEMs',
        chainId: '0x13881',
        rpc: "https://rpc-mumbai.maticvigil.com",
        chainName: '',
        contractResource: '',
        abiContractResource: '',
        contract: '0x0220a3Ca822126086285460D15E3a9EF9752a7e5',
        baseUri: PolygonLogo,
        destinationContract: '0xEbA53D52952a70CB7D95e622557d9C7FE6D3c01b',
        type: 'source',
        icon: PolygonLogo
    },
    celo: {
        name: 'Celo GEMs',
        chainId: '0xaef3',
        rpc: "https://alfajores-forno.celo-testnet.org",
        chainName: '',
        contractResource: '',
        abiContractResource: '',
        contract: '0xF36C5D57129B4CEdE55dBe7e79da00f32388E12d',
        baseUri: CeloLogo,
        destinationContract: '',
        type: 'source',
        icon: CeloLogo,
    },
    moonbeam: {
        name: 'Moonbeam GEMs',
        chainId: '0x507',
        rpc: "https://rpc.testnet.moonbeam.network",
        chainName: '',
        contractResource: '',
        abiContractResource: '',
        contract: '0x4afbd789A72359205143Bd9A2f6A6D8b1462BD86',
        baseUri: MoonbeamLogo,
        destinationContract: '',
        type: 'source',
        icon: MoonbeamLogo,
    },
}


export const DESTINATION_CHAINS: {
    avax_celo: CHainType,
    avax_fantom: CHainType,
    avax_polygon: CHainType,
    avax_moonbeam: CHainType,
} = {
    avax_celo: {
        name: 'Celo GEMs',
        chainId: '0xa869',
        rpc: "https://api.avax-test.network/ext/bc/C/rpc",
        chainName: '',
        contractResource: '',
        abiContractResource: '',
        contract: '0xA03dB9EC201Bd19f1803D0408197BdF0d2912E59',
        baseUri: CeloLogo,
        destinationContract: '',
        type: 'destination',
        icon: AvaxLogo,
        icon2: CeloLogo
    },
    avax_fantom: {
        name: 'Fantom GEMs',
        chainId: '0xa869',
        rpc: "https://api.avax-test.network/ext/bc/C/rpc",
        chainName: '',
        contractResource: '',
        abiContractResource: '',
        contract: '0x8cF7132a823d4B998C9bfe46b9DE6d3a6f0CFad6',
        baseUri: FantomLogo,
        destinationContract: '',
        type: 'destination',
        icon: AvaxLogo,
        icon2: FantomLogo
    },
    avax_polygon: {
        name: 'Polygon GEMs',
        chainId: '0xa869',
        rpc: "https://api.avax-test.network/ext/bc/C/rpc",
        chainName: '',
        contractResource: '',
        abiContractResource: '',
        contract: '0x57dBf062a5853794975219861F11cfD3Ae92C58e',
        baseUri: PolygonLogo,
        destinationContract: '',
        type: 'destination',
        icon: AvaxLogo,
        icon2: PolygonLogo
    },
    avax_moonbeam: {
        name: 'Moonbeam GEMs',
        chainId: '0xa869',
        rpc: "https://api.avax-test.network/ext/bc/C/rpc",
        chainName: '',
        contractResource: '',
        abiContractResource: '',
        contract: '0x0874fc46009698d2bF200Ca2fC3CbA5bB1B87CFf',
        baseUri: MoonbeamLogo,
        destinationContract: '',
        type: 'destination',
        icon: AvaxLogo,
        icon2: MoonbeamLogo
    }
}
