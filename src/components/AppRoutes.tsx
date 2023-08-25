import {Route, Routes} from "react-router-dom";
import Layout from "./Layout.tsx";
import {CHAINS} from "../utils/constants.tsx";
import Inventory from "./Inventory.tsx";
import {NotFoundPage} from "../pages/NotFoundPage.tsx";
import {ChainsInventory} from "./ChainInventory.tsx";
import Starknet from "../pages/Starknet.tsx";

const routes = [
    {element: <ChainsInventory chains={[CHAINS.celo]}/>, path: '/celo'},
    {element: <ChainsInventory chains={[CHAINS.fantom]}/>, path: '/fantom'},
    {element: <ChainsInventory chains={[CHAINS.polygon]}/>, path: '/polygon'},
    {element: <ChainsInventory chains={[CHAINS.moonbeam]}/>, path: '/moonbeam'},
    {element: <Inventory/>, path: '/inventory'},
    {element: <Starknet/>, path: '/starknet'},
    {element: <NotFoundPage/>, path: '/*'},
]

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    {routes?.map(r =>
                        <Route key={r.path} path={r.path} element={r.element}/>
                    )}
                </Route>
            </Routes>
        </>
    );
}

export default AppRoutes;