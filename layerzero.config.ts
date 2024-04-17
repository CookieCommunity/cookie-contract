// eslint-disable-next-line @typescript-eslint/no-var-requires
import { EndpointId } from '@layerzerolabs/lz-definitions'

// https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts

const baseContract = {
    eid: EndpointId.BASESEP_V2_TESTNET,
    contractName: 'Cookie',
}

const sepoliaContract = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'OmnichainToken',
}

export default {
    contracts: [
        {
            contract: baseContract,
        },
        {
            contract: sepoliaContract,
        },
    ],
    connections: [
        {
            from: baseContract,
            to: sepoliaContract,
        },
        {
            from: sepoliaContract,
            to: baseContract,
        },
    ],
}
