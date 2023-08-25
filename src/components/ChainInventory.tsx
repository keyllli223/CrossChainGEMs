import {CHainType} from "../utils/constants.tsx";
import {
    Alert,
    Button,
    Card,
    Center,
    createStyles,
    Flex,
    Grid,
    Group,
    Image,
    Indicator,
    Loader,
    Modal,
    Paper,
    rem,
    Stack,
    Text,
    UnstyledButton
} from "@mantine/core";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import MintNft from "./MintNft.tsx";
import {useDisclosure} from "@mantine/hooks";
import {AxelarQueryAPI} from "@axelar-network/axelarjs-sdk";
import {Link} from "react-router-dom";
import {notifications} from "@mantine/notifications";
import {SOURCE_NFT_SUBSCRIPTION_ABI} from "../utils/abis/sourceAbi.tsx";
import {useMetaMask} from "../utils/walletConnection/useMetamask.ts";
import {DESTINATION_NFT_SUBSCRIPTION_ABI} from "../utils/abis/destinationAbi.tsx";

type Batch = {
    id: any,
    uri: any,
}

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: theme.radius.md,
        height: rem(90),
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease, transform 100ms ease',
        '&:hover': {
            boxShadow: theme.shadows.sm,
            transform: 'scale(1.05)',
        },
    },
    itemActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3],
        boxShadow: theme.shadows.md,
    }
}));

const PAGE_LIMIT = 6

export const ChainsInventory = ({chains, mintAndBridge = true}: {
    chains: CHainType[],
    mintAndBridge?: boolean
}) => {
    const {classes} = useStyles();

    return <Card withBorder radius="md" className={classes.card}>
        {chains?.length > 1
            ? <Stack>
                {chains?.map(item =>
                    <Card withBorder radius="md" className={classes.card}>
                        <ChainInventoryList chain={item} mintAndBridge={mintAndBridge}/>
                    </Card>
                )}
            </Stack>
            : chains?.map(item =>
                <ChainInventoryList chain={item} mintAndBridge={mintAndBridge}/>
            )
        }
    </Card>
}

export const ChainInventoryList = ({chain, mintAndBridge = true}: { chain: CHainType, mintAndBridge?: boolean }) => {
    const {classes, cx} = useStyles();
    const {account, chainId, connect, switchChain, status} = useMetaMask();

    const [batches, setBatches] = useState<Batch[]>([])
    const [isLoadingBatches, setIsLoadingBatches] = useState(false)
    const [contractRead, setContractRead] = useState<any>(null)
    const [batchesCount, setBatchesCount] = useState(0)
    const [selectedNft, setSelectedNft] = useState<Batch | null>(null)
    const [isLoadingBridge, setIsLoadingBridge] = useState(false)
    const [isLoadingGetReward, setIsLoadingGetReward] = useState(false)
    const [opened, {open, close}] = useDisclosure(false);
    const [destinationChain, setDestinationChain] = useState('')
    const [sourceChain, setSourceChain] = useState('')
    const [transactionTx, setTransactionTx] = useState<{ hash: string } | null>(null)
    const [rewardAmount, setRewardAmount] = useState(0)

    const getBatches = async ({from, to, initialData}: { from: number, to: number, initialData: any }) => {
        const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = metamaskProvider.getSigner();

        setIsLoadingBatches(true);

        try {
            const batchPromises = [];
            for (let i = from; i < to; i++) {
                batchPromises.push(contractRead.tokenOfOwnerByIndex(signer.getAddress(), i));
            }

            const batchInfos = await Promise.all(batchPromises);

            const arr = batchInfos.map(batchInfo => ({
                id: parseInt(batchInfo),
                uri: chain.baseUri
            }));

            setBatches([...initialData, ...arr]);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingBatches(false);
        }
    };

    const handlerSetSelectNft = (nft: any) => {
        if (selectedNft !== null && selectedNft?.id === nft?.id) {
            setSelectedNft(null)
        } else {
            setSelectedNft({...nft, uri: collectionUri?.image})
        }
    }


    const handlerOpenModal = async () => {
        if (chain?.type === 'source') {
            setTransactionTx(null)
            const source = await contractRead.sourceChain()
            const destination = await contractRead.destinationChain()
            setSourceChain(source)
            setDestinationChain(destination)
        } else {
            const rewardAmount = await contractRead.rewardAmount()
            setRewardAmount(parseInt(rewardAmount) / 10 ** 18)
        }
        open()
    }

    const handlerBridge = async () => {
        setIsLoadingBridge(true)

        // @ts-ignore
        const sdk = new AxelarQueryAPI({environment: "testnet",});
        // @ts-ignore
        const fee: any = await sdk.estimateGasFee(sourceChain, destinationChain)

        try {
            const customHttpProvider = new ethers.providers.JsonRpcProvider(chain.rpc);
            const contractRead = new ethers.Contract(chain.contract, SOURCE_NFT_SUBSCRIPTION_ABI, customHttpProvider);
            const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = metamaskProvider.getSigner();
            const contractWrite = contractRead.connect(signer)
            const tx = await contractWrite.sendNFT(selectedNft?.id, {
                value: (fee * 1.5).toString(),
                gasLimit: 2000000
            })
            await tx.wait();
            setTransactionTx(tx)
            setIsLoadingBridge(false)
            notifications.show({
                title: 'Success!',
                message: `Success Bridge. Tx hash: ${tx?.hash}`,
                color: 'blue'
            })
        } catch (e) {
            console.log(e)
            setIsLoadingBridge(false)
            notifications.show({
                title: 'Error!',
                message: ``,
                color: 'red'
            })
        }
    }

    const handlerGetReward = async () => {
        if (chain?.chainId === chainId) {
            setIsLoadingGetReward(true)
            try {
                const customHttpProvider = new ethers.providers.JsonRpcProvider(chain.rpc);
                const contractRead = new ethers.Contract(chain.contract, chain?.type === 'source' ? SOURCE_NFT_SUBSCRIPTION_ABI : DESTINATION_NFT_SUBSCRIPTION_ABI, customHttpProvider);
                const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = metamaskProvider.getSigner();
                const contractWrite = contractRead.connect(signer)
                const tx = await contractWrite.getReward(selectedNft?.id)
                await tx.wait();
                setTransactionTx(tx)
                setIsLoadingGetReward(false)
                notifications.show({
                    title: 'Success!',
                    message: `Success. Tx hash: ${tx?.hash}`,
                    color: 'blue'
                })
            } catch (e) {
                console.log(e)
                setIsLoadingGetReward(false)
                notifications.show({
                    title: 'Error!',
                    message: ``,
                    color: 'red'
                })
            }
        } else {
            notifications.show({
                title: 'Error!',
                message: `Connect to Avalanche!`,
                color: 'red'
            })
        }
    }

    useEffect(() => {
        setBatches([])
        const customHttpProvider = new ethers.providers.JsonRpcProvider(chain?.rpc);
        const cRead = new ethers.Contract(chain.contract, chain?.type === 'source' ? SOURCE_NFT_SUBSCRIPTION_ABI : DESTINATION_NFT_SUBSCRIPTION_ABI, customHttpProvider);
        setContractRead(cRead)
    }, [chain])

    const [collectionUri, setCollectionUri] = useState<{image: string} | null>(null)

    useEffect(() => {
        const getData = async () => {
            const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = metamaskProvider.getSigner();
            const address = await signer.getAddress()
            const batchesCount = await contractRead.balanceOf(address)
            setBatchesCount(parseInt(batchesCount))
            if (collectionUri === null) {
                const collectionURI = await contractRead.collectionURI()
                if (collectionURI?.includes('ipfs')) {
                    const res = await fetch('https://corsproxy.xyz/' + collectionURI)
                    const data = await res.json();
                    setCollectionUri(data)
                }
            }
            // if (parseInt(batchesCount) !== 0)
            await getBatches({from: 0, to: Math.min(PAGE_LIMIT, parseInt(batchesCount)), initialData: []})
        }

        if (contractRead && account) {
            getData()
        }

    }, [contractRead, account])

    return (
        <>
            {chain.type === 'source'
                ? <Modal opened={opened} onClose={close} title={
                    <>
                        Bridge from {' '}
                        <span style={{color: '#1971c2'}}>{sourceChain}{' '}</span>
                        to {' '}
                        <span style={{color: '#1971c2'}}>{destinationChain}</span>
                    </>
                }
                         centered>
                    {transactionTx == null
                        ? <Stack>
                            <Center>
                                <Paper w={'max-content'} p={'md'} radius="md" withBorder>
                                    <Indicator position={'bottom-center'} inline label={`#${selectedNft?.id}`}
                                               size={16}>
                                        <Image withPlaceholder src={selectedNft?.uri} width={64} height={64}
                                               radius="md"/>
                                    </Indicator>
                                </Paper>
                            </Center>
                            <Button
                                loading={isLoadingBridge}
                                onClick={handlerBridge}
                            >
                                Bridge
                            </Button>
                        </Stack>
                        : <Stack>
                            <Alert color={'green'}>
                                <Stack>
                                    <Text>
                                        Success bridge!
                                    </Text>
                                </Stack>
                            </Alert>
                            <Text fw={600}>
                                View transaction on {' '}
                                <Link target={'_blank'} to={`https://testnet.axelarscan.io/gmp/${transactionTx?.hash}`}>
                                    explorer
                                </Link>
                            </Text>
                        </Stack>
                    }
                </Modal>
                : <Modal opened={opened} onClose={close}
                         title={
                             <>
                                 Sell this GEM for {rewardAmount} AVAX
                             </>
                         }
                         centered>
                    {transactionTx == null
                        ? <Stack>
                            <Center>
                                <Paper w={'max-content'} p={'md'} radius="md" withBorder>
                                    <Indicator position={'bottom-center'} inline label={`#${selectedNft?.id}`}
                                               size={16}>
                                        <Image withPlaceholder src={selectedNft?.uri} width={64} height={64}
                                               radius="md"/>
                                    </Indicator>
                                </Paper>
                            </Center>
                            <Button
                                loading={isLoadingGetReward}
                                onClick={handlerGetReward}
                            >
                                Get Reward
                            </Button>
                        </Stack>
                        : <Stack>
                            <Alert color={'green'}>
                                <Stack>
                                    <Text>
                                        You successful sold this GEM for {rewardAmount} AVAX
                                    </Text>
                                </Stack>
                            </Alert>
                        </Stack>
                    }
                </Modal>
            }
            <Group position="apart">
                <Flex align={'center'}>
                    {!chain?.icon2 &&
                        <Image mr={'sm'} width={20} height={20} src={chain.icon}/>
                    }
                    {chain?.icon2 &&
                        <Image mr={'sm'} width={20} height={20} src={chain.icon2}/>
                    }
                    <Text className={classes.title}>
                        You have {batchesCount} {' '}
                        {chain.name}{' '}
                        {chain?.type === 'destination' &&
                            <span style={{color: '#1971c2'}}>[bridged]</span>
                        }
                    </Text>
                </Flex>
                <Flex gap={20}>
                    {mintAndBridge &&
                        <MintNft chain={chain}/>
                    }

                    {chain.type === 'source' &&
                        <>
                            {(status === "notConnected" || status === "connecting") &&
                                <Button
                                    loading={status === "connecting"}
                                    fullWidth
                                    onClick={() => {
                                        connect()
                                        switchChain(chain?.chainId)
                                    }}
                                >
                                    Connect
                                </Button>
                            }

                            {chainId !== chain?.chainId && (status === 'connected' || status === "connecting") &&
                                <Button loading={status === "connecting"} variant={'outline'}
                                        onClick={() => switchChain(chain.chainId)}>
                                    Switch network
                                </Button>
                            }

                            {status === "unavailable" &&
                                <Alert color="red">
                                    MetaMask not available
                                </Alert>
                            }
                        </>
                    }

                    {chain.type === 'source' && chainId === chain?.chainId &&
                        <Button
                            loading={isLoadingBridge}
                            disabled={selectedNft === null}
                            onClick={handlerOpenModal}>
                            Bridge
                        </Button>
                    }
                    {chain.type === 'destination' &&
                        <Button
                            loading={isLoadingGetReward}
                            disabled={selectedNft === null}
                            onClick={handlerOpenModal}
                        >
                            Get Reward
                        </Button>
                    }
                </Flex>
            </Group>
            {isLoadingBatches && batches?.length === 0 &&
                <Center>
                    <Loader/>
                </Center>
            }

            {batches?.length !== 0 && collectionUri?.image &&
                <Grid mt="md">
                    {batches.map((item) =>
                        <Grid.Col xl={2} lg={2} md={2} xs={3} sm={3}>
                            <UnstyledButton
                                onClick={() => {
                                    handlerSetSelectNft(item)
                                }}
                                key={item?.id}>
                                <Paper p={'md'} radius="md"
                                       className={cx(classes.item, {[classes.itemActive]: selectedNft?.id === item?.id})}>
                                    <Indicator position={'bottom-center'} inline label={`#${item?.id}`} size={16}>
                                        <Image withPlaceholder src={collectionUri?.image} width={64} height={64} radius="md"/>
                                    </Indicator>
                                </Paper>
                            </UnstyledButton>
                        </Grid.Col>
                    )}
                </Grid>
            }

            {batches.length < batchesCount && batches?.length !== 0 &&
                <Center mt={'md'}>
                    <Button
                        loading={isLoadingBatches}
                        onClick={() => {
                            getBatches({
                                from: batches?.length,
                                to: Math.min(batches?.length + PAGE_LIMIT, batchesCount),
                                initialData: batches,
                            })
                        }}
                    >
                        Show more
                    </Button>
                </Center>
            }
        </>
    );
}

