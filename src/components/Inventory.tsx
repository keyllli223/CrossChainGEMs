import {CHAINS, DESTINATION_CHAINS} from "../utils/constants.tsx";
import {Flex, Image, Stack, Text} from "@mantine/core";
import {ChainsInventory} from "./ChainInventory.tsx";
import AvaxLogo from '../assets/avax.png'

const Inventory = () => {
    return (
        <Stack w={'100%'}>
            <ChainsInventory mintAndBridge={false} chains={[CHAINS.celo]}/>
            <ChainsInventory mintAndBridge={false} chains={[CHAINS.fantom]}/>
            <ChainsInventory mintAndBridge={false} chains={[CHAINS.polygon]}/>
            <ChainsInventory mintAndBridge={false} chains={[CHAINS.moonbeam]}/>
            <Flex mt={'lg'}  align={'center'} gap={1}>
                <Image mr={'sm'} width={20} height={20} src={AvaxLogo}/>
                <Text fw={700} fz={20}>Destination (AVAX Chain)</Text>
            </Flex>
            <ChainsInventory
                mintAndBridge={false}
                chains={[DESTINATION_CHAINS.avax_celo, DESTINATION_CHAINS.avax_fantom, DESTINATION_CHAINS.avax_polygon, DESTINATION_CHAINS.avax_moonbeam]}
            />
        </Stack>
    );
}

export default Inventory;