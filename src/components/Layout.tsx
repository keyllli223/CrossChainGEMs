import {useState} from 'react';
import {AppShell, Burger, Container, Flex, Header, Image, MediaQuery, useMantineTheme,} from '@mantine/core';
import {AppNavbar} from "./AppNavbar.tsx";
import {SwitchTheme} from "./SwitchTheme.tsx";
import {Outlet} from "react-router-dom";
import LogoImg from '../assets/logo.png'

const Layout = () => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<AppNavbar hidden={!opened}/>}
            header={
                <Header height={{base: 50, md: 70}} p="md">
                    <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                        <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>

                        <Flex w={'100%'} align={'center'} justify={'space-between'}>
                            <Image width={35} height={35} src={LogoImg}/>
                            <SwitchTheme/>
                        </Flex>
                    </div>
                </Header>
            }
        >
            <Container size={'md'}>
                <Outlet/>
            </Container>
        </AppShell>
    );
};
export default Layout