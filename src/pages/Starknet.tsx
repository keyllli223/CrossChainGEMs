import {useEffect, useState} from 'react'
import {connect, disconnect as disconnectStarknet} from "@argent/get-starknet"
// @ts-ignore
import {cairo, CallData, Contract, Provider, shortString, uint256} from 'starknet'
import {ERC20_CONTRACT_ABI, ETH_CONTRACT_ADDRESS} from '../utils/abis/sterknetAbi.ts'
import {useStarknetStore} from "../store/useStarknetStore.tsx";
import {
    ActionIcon,
    Alert,
    Avatar,
    Badge,
    Button,
    Center,
    CopyButton,
    Flex,
    Image,
    List,
    Loader,
    Paper,
    Stack,
    Text,
    Title,
    Tooltip,
    UnstyledButton
} from "@mantine/core";
import {shortAddress} from "../utils/functions.tsx";
import {notifications} from "@mantine/notifications";
import {hex2ascii} from "../utils/hex2ascii.tsx";
import {IconCheck, IconCopy} from "@tabler/icons-react";

const Home = () => {
    const {starknet, setStarknet, provider, setProvider, walletAddress, setWalletAddress} = useStarknetStore()

    const [sendTokenBtn, setSendTokenBtn] = useState("Approve")
    const [recipientAddress, setRecipientAddress] = useState("")
    const [amountToSend, setAmountToSend] = useState()
    const [nftsCount, setNftsCount] = useState(0)
    // @ts-ignore
    const [tokenName, setTokenName] = useState("")
    // @ts-ignore
    const [availableFunds, setAvailableFunds] = useState(0);
    const [isLoadingTransfer, setIsLoadingTransfer] = useState(false)
    const [isLoadingBurn, setIsLoadingBurn] = useState(false)
    const [isLoadingMint, setIsLoadingMint] = useState(false)
    const [isLoadingBridge, setIsLoadingBridge] = useState(false)
    const [isLoadingNfts, setIsLoadingNfts] = useState(false)
    const [selectedNft, setSelectedNft] = useState(0)
    const [nfts, setNfts] = useState<{ id: any }[]>([])

    const connectWallet = async () => {
        try {
            const connectRes = await connect()
            await connectRes?.enable()
            setWalletAddress(connectRes?.account.address)
            const _provider = new Provider({sequencer: {baseUrl: connectRes?.account.provider.baseUrl}});
            setProvider(_provider)
            setStarknet(connectRes)
        } catch (error) {
            notifications.show({
                title: 'Error!',
                message: `Unable to connect`,
                color: 'red'
            })
            console.log(error)
        }
    }

    const readContractDetails = async () => {
        const contractInstance = new Contract(ERC20_CONTRACT_ABI, ETH_CONTRACT_ADDRESS, provider);
        const tokenName = await contractInstance.get_name()

        const toHex = shortString.decodeShortString(tokenName);
        const name = hex2ascii(toHex);
        setTokenName(name);
        let tokenBalance = await contractInstance.balance_of(walletAddress);
        tokenBalance = (uint256.uint256ToBN(tokenBalance).toString())

        let nftCount = await contractInstance.get_nfts_count();
        nftCount = (uint256.uint256ToBN(nftCount).toString())
        setNftsCount(nftCount)
        getNfts(nftCount)
        tokenBalance = tokenBalance / (1 * 10 ** 18)
        return tokenBalance.toString().slice(0, 10)
    }

    const transferTokens = async () => {
        try {
            setIsLoadingTransfer(true)
            setSendTokenBtn("Approving")
            const tokensToSend = amountToSend! * 10 ** 18;
            const approveTokens = await starknet?.account.execute({
                contractAddress: ETH_CONTRACT_ADDRESS,
                entrypoint: 'approve',
                calldata: CallData.compile({
                    recipient: walletAddress,
                    amount: cairo.uint256(tokensToSend)
                })
            })
            await provider.waitForTransaction(approveTokens.transaction_hash);
            notifications.show({
                title: 'Success!',
                message: `Token approved!`,
                color: 'blue'
            })
            setSendTokenBtn("Send");
            await provider.waitForTransaction(approveTokens.transaction_hash);
            const transferToken = await starknet?.account.execute({
                contractAddress: ETH_CONTRACT_ADDRESS,
                entrypoint: 'transfer',
                calldata: CallData.compile({
                    recipient: recipientAddress,
                    amount: cairo.uint256(tokensToSend)
                })
            })
            await provider.waitForTransaction(transferToken.transaction_hash);
            notifications.show({
                title: 'Success!',
                message: `Token transferred successfully`,
                color: 'blue'
            })
            setIsLoadingTransfer(false)
            setSendTokenBtn("Approve")
        } catch (error) {
            notifications.show({
                title: 'Error!',
                message: `Something went wrong`,
                color: 'red'
            })
            setSendTokenBtn("Approve")
            setIsLoadingTransfer(false)
            console.log(error)
        }
    }

    const getUserBalance = async () => {
        const bal = await readContractDetails()
        setAvailableFunds(bal);
    }

    const getNfts = async (nftsCount: any) => {
        setIsLoadingNfts(true)
        const arr = []
        for (let i = 1; i <= nftsCount; i++) {
            const contractInstance = new Contract(ERC20_CONTRACT_ABI, ETH_CONTRACT_ADDRESS, provider);
            const owner_of = await contractInstance.owner_of(cairo.uint256(i));
            if (BigInt(starknet?.account?.address) === owner_of) {
                arr.push({id: i})
            }
        }
        setNfts(arr)
        setIsLoadingNfts(false)
    }

    const minNft = async () => {
        if (starknet?.isConnected) {
            try {
                setIsLoadingMint(true)
                const mint = await starknet?.account.execute({
                    contractAddress: ETH_CONTRACT_ADDRESS,
                    entrypoint: 'mint',
                    calldata: CallData.compile({})
                })
                await provider.waitForTransaction(mint.transaction_hash);
                notifications.show({
                    title: 'Success!',
                    message: `Successfully mint`,
                    color: 'blue'
                })
                setIsLoadingMint(false)
            } catch (e) {
                setIsLoadingMint(false)
                console.log(e)
            }
        } else {
            notifications.show({
                title: 'Error!',
                message: `Connect Starknet wallet!`,
                color: 'orange'
            })
        }
    }

    const burnNft = async (nftIndex: number) => {
        if (starknet?.isConnected) {
            try {
                setSelectedNft(nftIndex)
                setIsLoadingBurn(true)
                const burn = await starknet?.account.execute({
                    contractAddress: ETH_CONTRACT_ADDRESS,
                    entrypoint: 'burn',
                    calldata: CallData.compile({token_id: cairo.uint256(nftIndex)})
                })
                await provider.waitForTransaction(burn.transaction_hash);
                notifications.show({
                    title: 'Success!',
                    message: `Successfully burn`,
                    color: 'blue'
                })
                setIsLoadingBurn(false)
            } catch (e) {
                setIsLoadingBurn(false)
                console.log(e)
            }
        } else {
            notifications.show({
                title: 'Error!',
                message: `Connect Starknet wallet!`,
                color: 'orange'
            })
        }
    }

    const bridgeNft = async (nftIndex: number) => {
        if (starknet?.isConnected) {
            try {
                setSelectedNft(nftIndex)
                setIsLoadingBridge(true)
                const bridge = await starknet?.account.execute({
                    contractAddress: ETH_CONTRACT_ADDRESS,
                    entrypoint: 'bridge',
                    calldata: CallData.compile({token_id: nftIndex})
                })
                await provider.waitForTransaction(bridge.transaction_hash);
                notifications.show({
                    title: 'Success!',
                    message: `Successfully bridge`,
                    color: 'blue'
                })
                setIsLoadingBridge(false)
            } catch (e) {
                setIsLoadingBridge(false)
                console.log(e)
            }
        } else {
            notifications.show({
                title: 'Error!',
                message: `Connect Starknet wallet!`,
                color: 'orange'
            })
        }
    }

    const getRecipientAddress = (e: any) => setRecipientAddress(e.target.value)

    const getSendingAmount = (e: any) => setAmountToSend(e.target.value)

    const handlerDisconnectStarknet = async () => {
        await disconnectStarknet()
        setStarknet(null)
    }

    useEffect(() => {
        if (starknet?.isConnected) {
            getUserBalance()
        }
    }, [starknet])

    return (
        <>
            <Title mb={'sm'} fz={25}>Starknet GOERLI</Title>
            {!starknet?.isConnected &&
                <Button mb={'md'} onClick={connectWallet}>
                    Connect Starknet
                </Button>
            }
            {starknet?.isConnected &&
                <Stack spacing={5}>
                    <Flex gap={10} justify={'space-between'} align={'center'} w={'100%'}>
                        <Paper mb={'md'} w={'100%'} withBorder p={'xs'}>
                            <Stack spacing={5} w={'100%'}>
                                <Flex wrap={'wrap'} align={'center'} justify={'space-between'}>
                                    <CopyButton value={starknet?.account?.address} timeout={2000}>
                                        {({copied, copy}) => (
                                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                                <UnstyledButton onClick={copy}>
                                                    <Flex align={'center'}>
                                                        <Badge>
                                                            {shortAddress(starknet?.account?.address, 30)}
                                                        </Badge>
                                                        <ActionIcon color={copied ? 'teal' : 'gray'}>
                                                            {copied ? <IconCheck size="1rem"/> :
                                                                <IconCopy size="1rem"/>}
                                                        </ActionIcon>
                                                    </Flex>
                                                </UnstyledButton>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                    <Badge ml={'auto'} variant={'outline'} w={'min-content'} pl={0}
                                           leftSection={<Avatar radius={'50%'} size={18} src={starknet?.icon}/>}
                                           size="md">
                                        {starknet?.chainId}
                                    </Badge>
                                    <Button
                                        ml={'md'}
                                        w={'max-content'}
                                        p={'sm'}
                                        py={'0'}
                                        radius={3}
                                        variant={'filled'}
                                        style={{cursor: "pointer"}}
                                        color={'red'}
                                        onClick={handlerDisconnectStarknet}
                                    >
                                        Disconnect
                                    </Button>
                                </Flex>
                            </Stack>
                        </Paper>
                    </Flex>
                </Stack>
            }

            <Stack>
                <Paper w={'100%'} withBorder p={'xs'}>
                    <Flex w={'100%'} justify={'space-between'} align={'center'}>
                        <Flex gap={5} align={'center'}>
                            <Title fz={15}>NFTs</Title>
                            <Badge w={'max-content'}>{nfts?.length}</Badge>
                        </Flex>
                        <Button loading={isLoadingMint} onClick={minNft}>
                            Mint
                        </Button>
                    </Flex>
                    <Flex wrap={'wrap'} gap={10}>
                        {isLoadingNfts
                            ? <Center><Loader/></Center>
                            : starknet?.isConnected && <>
                            {nfts.map((item) =>
                                <Paper w={'max-content'} withBorder p={'xs'}>
                                    <Stack align={'center'} justify={'center'}>
                                        <Image
                                            withPlaceholder
                                            src={'https://ipfs.moralis.io:2053/ipfs/QmRLAvWAGjJatut2RvucyMY5DA8zS2riRuT1v3sBNbkiL7/STARKNET?fbclid=IwAR3m_RPxQdNe4rwCkxP4AWgmEN0PglbXILWKN03o0UwWCYwtSQFGDdiwXEo'}
                                            width={64} height={64}
                                            radius="md"
                                        />
                                        <Badge w={'100%'}>
                                            {item?.id}
                                        </Badge>
                                        <Flex gap={10}>
                                            {/*<Button loading={isLoadingBurn && selectedNft === item.id} color={'red'}*/}
                                            {/*        onClick={() => burnNft(item?.id)}>*/}
                                            {/*    Burn*/}
                                            {/*</Button>*/}
                                            <Button loading={isLoadingBridge && selectedNft === item.id}
                                                    color={'blue'} onClick={() => bridgeNft(item?.id)}>
                                                Bridge to ETH_GOERLI
                                            </Button>
                                        </Flex>
                                    </Stack>
                                </Paper>
                            )}
                        </>
                        }
                    </Flex>
                </Paper>
                <Paper w={'100%'} withBorder p={'xs'}>
                    <Alert color={'yellow'}>
                        <Text>You cannot bridge a Starknet GEM dirrectly to AVAX. In order to do that, you need:</Text>
                        <List>
                            <List.Item>Bridge a Starknet GEM to ETH Goerli;</List.Item>
                            <List.Item>Wait some time for confirmation (~ 5 hours, this process involves L2 → L1
                                messaging)</List.Item>
                            <List.Item>Claim manually the Starknet GEM (bridged) on ETH Goerli.</List.Item>
                            <List.Item>Bridge from ETH Goerli to AVAX.</List.Item>
                        </List>
                    </Alert>
                </Paper>


                <Title fz={25}>ETH GOERLI</Title>
                <Paper mb={'md'} w={'100%'} withBorder p={'xs'}>
                </Paper>
                {/*<Paper w={'100%'} withBorder p={'xs'}>*/}
                {/*    <Flex mb={'md'} justify={'space-between'}>*/}
                {/*        <Badge>Transfer Tokens</Badge>*/}
                {/*        /!*<Badge variant={'outline'}>Available funds: {availableFunds} {tokenName}</Badge>*!/*/}
                {/*    </Flex>*/}
                {/*    <Stack>*/}
                {/*        <TextInput*/}
                {/*            type="text"*/}
                {/*            onChange={getRecipientAddress}*/}
                {/*            placeholder='Recipient Wallet Address'*/}
                {/*        />*/}
                {/*        <TextInput type="number" onChange={getSendingAmount} placeholder='Amount to send'/>*/}
                {/*        <Button loading={isLoadingTransfer} onClick={transferTokens}>{sendTokenBtn}</Button>*/}
                {/*    </Stack>*/}
                {/*</Paper>*/}
            </Stack>
        </>
    )
};

export default Home