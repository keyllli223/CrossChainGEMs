export const ETH_CONTRACT_ADDRESS = "0x03dc5a1ed0df3b7b655c2170ef443e42ff214b9193707d5ebd0565eb03ab319b"
export const ERC20_CONTRACT_ABI = [{
    "type": "function",
    "name": "get_contract_owner",
    "inputs": [],
    "outputs": [{"type": "core::starknet::contract_address::ContractAddress"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "get_l1_address",
    "inputs": [],
    "outputs": [{"type": "core::felt252"}],
    "state_mutability": "view"
}, {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [{"name": "low", "type": "core::integer::u128"}, {"name": "high", "type": "core::integer::u128"}]
}, {
    "type": "function",
    "name": "get_nfts_count",
    "inputs": [],
    "outputs": [{"type": "core::integer::u256"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "get_name",
    "inputs": [],
    "outputs": [{"type": "core::felt252"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "get_symbol",
    "inputs": [],
    "outputs": [{"type": "core::felt252"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "get_token_uri",
    "inputs": [{"name": "token_id", "type": "core::integer::u256"}],
    "outputs": [{"type": "core::felt252"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "balance_of",
    "inputs": [{"name": "account", "type": "core::starknet::contract_address::ContractAddress"}],
    "outputs": [{"type": "core::integer::u256"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "owner_of",
    "inputs": [{"name": "token_id", "type": "core::integer::u256"}],
    "outputs": [{"type": "core::starknet::contract_address::ContractAddress"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "get_approved",
    "inputs": [{"name": "token_id", "type": "core::integer::u256"}],
    "outputs": [{"type": "core::starknet::contract_address::ContractAddress"}],
    "state_mutability": "view"
}, {
    "type": "enum",
    "name": "core::bool",
    "variants": [{"name": "False", "type": "()"}, {"name": "True", "type": "()"}]
}, {
    "type": "function",
    "name": "is_approved_for_all",
    "inputs": [{"name": "owner", "type": "core::starknet::contract_address::ContractAddress"}, {
        "name": "operator",
        "type": "core::starknet::contract_address::ContractAddress"
    }],
    "outputs": [{"type": "core::bool"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "_exists",
    "inputs": [{"name": "token_id", "type": "core::integer::u256"}],
    "outputs": [{"type": "core::bool"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "_is_approved_or_owner",
    "inputs": [{"name": "spender", "type": "core::starknet::contract_address::ContractAddress"}, {
        "name": "token_id",
        "type": "core::integer::u256"
    }],
    "outputs": [{"type": "core::bool"}],
    "state_mutability": "view"
}, {
    "type": "function",
    "name": "approve",
    "inputs": [{"name": "to", "type": "core::starknet::contract_address::ContractAddress"}, {
        "name": "token_id",
        "type": "core::integer::u256"
    }],
    "outputs": [],
    "state_mutability": "external"
}, {
    "type": "function",
    "name": "set_approval_for_all",
    "inputs": [{"name": "operator", "type": "core::starknet::contract_address::ContractAddress"}, {
        "name": "approved",
        "type": "core::bool"
    }],
    "outputs": [],
    "state_mutability": "external"
}, {
    "type": "function",
    "name": "transfer_from",
    "inputs": [{"name": "from", "type": "core::starknet::contract_address::ContractAddress"}, {
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress"
    }, {"name": "token_id", "type": "core::integer::u256"}],
    "outputs": [],
    "state_mutability": "external"
}, {
    "type": "function",
    "name": "bridge",
    "inputs": [{"name": "token_id", "type": "core::integer::u32"}],
    "outputs": [],
    "state_mutability": "external"
}, {
    "type": "function",
    "name": "mint",
    "inputs": [],
    "outputs": [],
    "state_mutability": "external"
}, {
    "type": "function",
    "name": "transfer",
    "inputs": [{"name": "to", "type": "core::starknet::contract_address::ContractAddress"}, {
        "name": "token_id",
        "type": "core::integer::u256"
    }],
    "outputs": [],
    "state_mutability": "external"
}, {
    "type": "function",
    "name": "burn",
    "inputs": [{"name": "token_id", "type": "core::integer::u256"}],
    "outputs": [],
    "state_mutability": "external"
}, {
    "type": "function",
    "name": "update_l1_address",
    "inputs": [{"name": "_l1_address", "type": "core::felt252"}],
    "outputs": [],
    "state_mutability": "external"
}, {
    "type": "constructor",
    "name": "constructor",
    "inputs": [{
        "name": "_contract_owner",
        "type": "core::starknet::contract_address::ContractAddress"
    }, {"name": "_name", "type": "core::felt252"}, {
        "name": "_symbol",
        "type": "core::felt252"
    }, {"name": "_general_uri", "type": "core::felt252"}, {"name": "_l1_address", "type": "core::felt252"}]
}, {
    "type": "event",
    "name": "project::ERC721::ERC721Contract::Approval",
    "kind": "struct",
    "members": [{
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
    }, {"name": "to", "type": "core::starknet::contract_address::ContractAddress", "kind": "data"}, {
        "name": "token_id",
        "type": "core::integer::u256",
        "kind": "data"
    }]
}, {
    "type": "event",
    "name": "project::ERC721::ERC721Contract::BridgeNFT",
    "kind": "struct",
    "members": [{
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
    }, {"name": "token_id", "type": "core::integer::u256", "kind": "data"}]
}, {
    "type": "event",
    "name": "project::ERC721::ERC721Contract::Transfer",
    "kind": "struct",
    "members": [{
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
    }, {"name": "to", "type": "core::starknet::contract_address::ContractAddress", "kind": "data"}, {
        "name": "token_id",
        "type": "core::integer::u256",
        "kind": "data"
    }]
}, {
    "type": "event",
    "name": "project::ERC721::ERC721Contract::ApprovalForAll",
    "kind": "struct",
    "members": [{
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
    }, {
        "name": "operator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
    }, {"name": "approved", "type": "core::bool", "kind": "data"}]
}, {
    "type": "event",
    "name": "project::ERC721::ERC721Contract::Event",
    "kind": "enum",
    "variants": [{
        "name": "Approval",
        "type": "project::ERC721::ERC721Contract::Approval",
        "kind": "nested"
    }, {
        "name": "BridgeNFT",
        "type": "project::ERC721::ERC721Contract::BridgeNFT",
        "kind": "nested"
    }, {
        "name": "Transfer",
        "type": "project::ERC721::ERC721Contract::Transfer",
        "kind": "nested"
    }, {"name": "ApprovalForAll", "type": "project::ERC721::ERC721Contract::ApprovalForAll", "kind": "nested"}]
}]