import {useEffect, useState} from 'react';
import {
    ActionIcon,
    Alert,
    Avatar,
    Badge,
    Button,
    CopyButton,
    createStyles,
    Divider,
    Flex,
    getStylesRef,
    Image,
    Navbar,
    Paper,
    rem,
    Stack,
    Text,
    Tooltip,
    UnstyledButton
} from '@mantine/core';
import {IconAppsFilled, IconCheck, IconCopy,} from '@tabler/icons-react';
import {useMetaMask} from "../utils/walletConnection/useMetamask.ts";
import {shortAddress} from "../utils/functions.tsx";
import {Link, useLocation} from "react-router-dom";
import {useStarknetStore} from "../store/useStarknetStore.tsx";
import {connect as connectStarknet, disconnect as disconnectStarknet} from "@argent/get-starknet";
// @ts-ignore
import {Provider} from "starknet";
import {notifications} from "@mantine/notifications";
import FantomLogo from '../assets/fantom.png'
import PolygonLogo from '../assets/polygon.webp'
import StarknetLogo from '../assets/starknet.png'
import CeloLogo from '../assets/celo.png'
import MoonbeamLogo from '../assets/moonbeam.png'

const useStyles = createStyles((theme) => ({
    header: {
        paddingBottom: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.md} * 1.5)`,
        borderBottom: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    footer: {
        paddingTop: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderTop: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,

            [`& .${getStylesRef('icon')}`]: {
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            },
        },
    },

    linkIcon: {
        ref: getStylesRef('icon'),
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({variant: 'light', color: theme.primaryColor}).background,
            color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
            [`& .${getStylesRef('icon')}`]: {
                color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
            },
        },
    },
}));

export const AppNavbar = ({hidden}: { hidden: boolean }) => {
    const {classes, cx} = useStyles();
    const {status, connect, account, chainId, switchChain} = useMetaMask();
    const {starknet, setStarknet, setProvider, setWalletAddress} = useStarknetStore()
    const {pathname} = useLocation()

    const [active, setActive] = useState('Billing');

    const data = [
        {
            link: '/inventory',
            label: 'View inventory',
            icon: <IconAppsFilled className={classes.linkIcon} stroke={1.5}/>
        },
        {link: '/celo', label: 'Celo GEMs', icon: <Image mr={'sm'} width={22} height={22} src={CeloLogo}/>},
        {link: '/polygon', label: 'Polygon GEMs', icon: <Image mr={'sm'} width={22} height={22} src={PolygonLogo}/>},
        {link: '/moonbeam', label: 'Moonbeam GEMs', icon: <Image mr={'sm'} width={22} height={22} src={MoonbeamLogo}/>},
        {link: '/fantom', label: 'Fantom GEMs', icon: <Image mr={'sm'} width={22} height={22} src={FantomLogo}/>},
        {
            link: '/starknet',
            label: 'Starknet [ETH_GOERLY]',
            icon: <Image mr={'sm'} width={22} height={22} src={StarknetLogo}/>
        },
    ];

    const links = data.map((item) => (
        <>
            {item?.link?.includes('starknet') &&
                <Divider my={'md'}/>
            }
            <Link
                className={cx(classes.link, {[classes.linkActive]: item.link === active})}
                to={item.link}
                key={item.label}
                onClick={() => {
                    setActive(item.link);
                }}
            >
                {item.icon}
                <span>{item.label}</span>
            </Link>
        </>
    ));


    const enableStarknet = async () => {
        try {
            const connectRes = await connectStarknet()
            await connectRes?.enable()
            setStarknet(connectRes)
            setWalletAddress(connectRes?.account.address)
            const _provider = new Provider({sequencer: {baseUrl: connectRes?.account.provider.baseUrl}});
            setProvider(_provider)
        } catch (error) {
            notifications.show({
                title: 'Error!',
                message: `Unable to connect`,
                color: 'red'
            })
            console.log(error)
        }
    }

    const handlerDisconnectStarknet = async () => {
        await disconnectStarknet()
        setStarknet(null)
    }

    useEffect(() => {
        if (status === "connected") switchChain('80001')
    }, [status])

    useEffect(() => {
        setActive(pathname)
    }, [pathname])

    return (
        <Navbar zIndex={200} hidden={hidden} hiddenBreakpoint="sm" width={{sm: 200, lg: 300}} p="md">
            <Navbar.Section grow>
                {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                {starknet?.isConnected &&
                    <Stack spacing={5}>
                        <Flex gap={10} justify={'space-between'} align={'center'} w={'100%'}>
                            {/*<Avatar size={'sm'} src={starknet?.icon} radius="xl"/>*/}
                            <Paper w={'100%'} withBorder p={'xs'}>
                                <Stack spacing={5} w={'100%'}>
                                    <CopyButton value={starknet?.account?.address} timeout={2000}>
                                        {({copied, copy}) => (
                                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                                <UnstyledButton w={'min-content'} onClick={copy}>
                                                    <Flex align={'center'}>
                                                        <Badge>
                                                            {shortAddress(starknet?.account?.address, 15)}
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
                                    <Badge variant={'outline'} w={'100%'} pl={0}
                                           leftSection={<Avatar radius={'50%'} size={18} src={starknet?.icon}/>}
                                           size="md">
                                        {starknet?.chainId}
                                    </Badge>
                                    <Button
                                        p={'sm'}
                                        py={'0'}
                                        radius={3}
                                        variant={'filled'}
                                        style={{cursor: "pointer"}}
                                        fullWidth color={'red'}
                                        size={'xs'}
                                        onClick={handlerDisconnectStarknet}
                                    >
                                        Disconnect
                                    </Button>
                                </Stack>
                            </Paper>
                        </Flex>
                    </Stack>
                }

                {!starknet?.isConnected &&
                    <Button fullWidth onClick={() => enableStarknet()}>
                        Connect Starknet
                    </Button>
                }
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <Stack spacing={5}>
                    {status === "connected" &&
                        <Flex gap={10} justify={'space-between'} align={'center'} w={'100%'}>
                            <Avatar size={'sm'} src={''} radius="xl"/>
                            <div style={{flex: 1}}>
                                <Text size="sm" weight={500}>
                                    {shortAddress(account)}
                                </Text>
                                <Text color="dimmed" size="xs">
                                    {chainId}
                                </Text>
                            </div>
                        </Flex>
                    }

                    {status === "unavailable" &&
                        <Alert color="red">
                            MetaMask not available
                        </Alert>
                    }

                    {(status === "notConnected" || status === "connecting") &&
                        <Button
                            loading={status === "connecting"}
                            fullWidth
                            onClick={() => {
                                connect()
                                switchChain('80001')
                            }}
                        >
                            Connect
                        </Button>
                    }
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
};
