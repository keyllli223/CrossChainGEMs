import {useHotkeys, useLocalStorage} from "@mantine/hooks";
import {ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";
import AppRoutes from "./AppRoutes";
import {Notifications} from "@mantine/notifications";
import {ErrorBoundary} from "react-error-boundary";
import ErrorPage from "../pages/ErrorPage.tsx";
import {MetaMaskProvider} from "../utils/walletConnection/metamaskProvider.tsx";
import {BrowserRouter} from "react-router-dom";

const AppProviders = () => {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'app-color',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) => {
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    }

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    return <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorPage}>
            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider
                    withGlobalStyles
                    withCSSVariables
                    withNormalizeCSS
                    theme={{colorScheme}}
                >
                    <Notifications/>
                    <MetaMaskProvider>
                        <AppRoutes/>
                    </MetaMaskProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </ErrorBoundary>
    </BrowserRouter>
}

export default AppProviders