import {useState} from 'react';
import {CHainType} from "../utils/constants.tsx";
import {ethers} from "ethers";
import {Button} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {SOURCE_NFT_SUBSCRIPTION_ABI} from "../utils/abis/sourceAbi.tsx";
import {useMetaMask} from "../utils/walletConnection/useMetamask.ts";

const MintNft = ({chain}: { chain: CHainType }) => {
    const [isLoadingMint, setIsLoadingMint] = useState(false)
    const {status, chainId} = useMetaMask();

    const handlerMintNft = async () => {
        setIsLoadingMint(true)
        try {
            const customHttpProvider = new ethers.providers.JsonRpcProvider(chain.rpc);
            const contractRead = new ethers.Contract(chain.contract, SOURCE_NFT_SUBSCRIPTION_ABI, customHttpProvider);
            const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = metamaskProvider.getSigner();
            const contractWrite = contractRead.connect(signer)
            const tx = await contractWrite.mintNFT()
            await tx.wait();
            setIsLoadingMint(false)
            notifications.show({
                title: 'Success!',
                message: `Success mint. Tx hash: ${tx?.hash}`,
                color: 'blue'
            })
        } catch (e) {
            console.log(e)
            setIsLoadingMint(false)
            notifications.show({
                title: 'Error!',
                message: ``,
                color: 'red'
            })
        }
    }

    return <>
        {chainId === chain?.chainId && status === 'connected' &&
            <Button loading={isLoadingMint} onClick={handlerMintNft}>Mint</Button>
        }
    </>
}

export default MintNft;