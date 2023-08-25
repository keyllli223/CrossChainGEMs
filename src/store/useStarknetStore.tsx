import {create} from 'zustand'
import {StarknetWindowObject} from "@argent/get-starknet";

interface StarknetState {
    starknet: StarknetWindowObject | null,
    walletAddress: any,
    provider: any,
    setStarknet: (account: StarknetWindowObject | null) => void,
    setProvider: (p: any) => void,
    setWalletAddress: (a: any) => void,
}

export const useStarknetStore = create<StarknetState>()((set) => ({
    starknet: null,
    walletAddress: null,
    provider: null,
    setStarknet: (account: any) => set(() => ({starknet: account})),
    setProvider: (p: any) => set(() => ({provider: p})),
    setWalletAddress: (w: any) => set(() => ({walletAddress: w})),
}))