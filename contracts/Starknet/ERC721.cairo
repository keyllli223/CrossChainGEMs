#[starknet::contract]
mod ERC721Contract {
    use starknet::syscalls::send_message_to_l1_syscall;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::contract_address_to_felt252;
    use zeroable::Zeroable;
    use option::OptionTrait;
    use traits::Into;
    use traits::TryInto;
    use array::SpanTrait;
    use array::ArrayTrait;


    #[storage]
    struct Storage {
        contract_owner: ContractAddress,
        name: felt252,
        symbol: felt252,
        tokensCount: u256,
        owners: LegacyMap::<u256, ContractAddress>,
        balances: LegacyMap::<ContractAddress, u256>,
        token_approvals: LegacyMap::<u256, ContractAddress>,
        operator_approvals: LegacyMap::<(ContractAddress, ContractAddress), bool>,
        general_uri: felt252,
        l1_address: felt252
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Approval: Approval,
        BridgeNFT: BridgeNFT,
        Transfer: Transfer,
        ApprovalForAll: ApprovalForAll
    }

    #[derive(Drop, starknet::Event)]
    struct Approval {
        owner: ContractAddress,
        to: ContractAddress,
        token_id: u256
    }

    #[derive(Drop, starknet::Event)]
    struct Transfer {
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256
    }


    #[derive(Drop, starknet::Event)]
    struct BridgeNFT {
        from: ContractAddress,
        token_id: u256
    }
    

    #[derive(Drop, starknet::Event)]
    struct ApprovalForAll {
        owner: ContractAddress,
        operator: ContractAddress,
        approved: bool
    }


    #[constructor]
    fn constructor(
        ref self: ContractState, 
        _contract_owner: ContractAddress, 
        _name: felt252, 
        _symbol: felt252, 
        _general_uri: felt252, 
        _l1_address: felt252
    ) {
        self.contract_owner.write(_contract_owner);
        self.name.write(_name);
        self.symbol.write(_symbol);
        self.tokensCount.write(0.into());
        self.general_uri.write(_general_uri);
        self.l1_address.write(_l1_address);
    }


    #[external(v0)]
    #[generate_trait]
    impl IERC721Impl of IERC721Trait {
        fn get_contract_owner(self: @ContractState) -> ContractAddress {
            self.contract_owner.read()
        }

        fn get_l1_address(self: @ContractState) -> felt252 {
            self.l1_address.read()
        }

        fn get_nfts_count(self: @ContractState) -> u256 {
            self.tokensCount.read()
        }

        fn get_name(self: @ContractState) -> felt252 {
            self.name.read()
        }

        fn get_symbol(self: @ContractState) -> felt252 {
            self.symbol.read()
        }

        fn get_token_uri(self: @ContractState, token_id: u256) -> felt252 {
            assert(self._exists(token_id), 'ERC721: invalid token ID');
            self.general_uri.read()
        }

        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            assert(account.is_non_zero(), 'ERC721: address zero');
            self.balances.read(account)
        }

        fn owner_of(self: @ContractState, token_id: u256) -> ContractAddress {
            let owner = self.owners.read(token_id);
            // assert(owner.is_non_zero(), 'ERC721: invalid token ID');
            owner
        }

        fn get_approveddd(self: @ContractState, token_id: u256) -> ContractAddress {
            assert(self._exists(token_id), 'ERC721: invalid token ID');
            self.token_approvals.read(token_id)
        }

        fn is_approved_for_all(self: @ContractState, owner: ContractAddress, operator: ContractAddress) -> bool {
            self.operator_approvals.read((owner, operator))
        }


        fn _exists(self: @ContractState, token_id: u256) -> bool {
            self.owner_of(token_id).is_non_zero()
        }

        fn _is_approved_or_owner(self: @ContractState, spender: ContractAddress, token_id: u256) -> bool {
            let owner = self.owners.read(token_id);
            spender == owner
                || self.is_approved_for_all(owner, spender) 
                || self.get_approveddd(token_id) == spender
        }

        fn approve(ref self: ContractState, to: ContractAddress, token_id: u256) {
            let owner = self.owner_of(token_id);
            assert(to != owner, 'Approval to current owner');
            assert(get_caller_address() == owner || self.is_approved_for_all(owner, get_caller_address()), 'Not token owner');
            self.token_approvals.write(token_id, to);
            self.emit(
                Approval{ owner: self.owner_of(token_id), to: to, token_id: token_id }
            );
        }

        fn set_approval_for_all(ref self: ContractState, operator: ContractAddress, approved: bool) {
            let owner = get_caller_address();
            assert(owner != operator, 'ERC721: approve to caller');
            self.operator_approvals.write((owner, operator), approved);
            self.emit(
                ApprovalForAll{ owner: owner, operator: operator, approved: approved }
            );
        }


        fn transfer_from(ref self: ContractState, from: ContractAddress, to: ContractAddress, token_id: u256) {
            assert(self._exists(token_id.into()), 'ERC721: invalid token ID');
            assert(self._is_approved_or_owner(get_caller_address(), token_id), 'neither owner nor approved');
            self.transfer(to, token_id);
        }


        fn bridge(ref self: ContractState, token_id: usize) {
            assert(self._exists(token_id.into()), 'ERC721: invalid token ID');
            
            let caller = get_caller_address();
            assert(caller == self.owner_of(token_id.into()), 'ERC721: Caller is not owner');

            let mut payload: Array<felt252> = ArrayTrait::new();
            payload.append(token_id.into());

            send_message_to_l1_syscall(
                to_address: self.l1_address.read(), payload: payload.span()
            );

            self.emit(
                BridgeNFT{ from: caller, token_id: token_id.into() }
            );

            self.burn(token_id.into());  
        }


        fn mint(ref self: ContractState) {
            let caller = get_caller_address();
            // assert(!self.owner_of(token_id).is_non_zero(), 'ERC721: Token already minted');
            // assert(!self._exists(token_id), 'ERC721: invalid token ID');

            self.tokensCount.write(self.tokensCount.read() + 1.into());
            let lastId = self.tokensCount.read();

            let receiver_balance = self.balances.read(caller);
            self.balances.write(caller, receiver_balance + 1.into());

            self.owners.write(lastId, caller);

            self.emit(
                Transfer{ from: Zeroable::zero(), to: caller, token_id: lastId }
            );  
        }


        fn transfer(ref self: ContractState, to: ContractAddress, token_id: u256) {
            assert(self._exists(token_id), 'ERC721: invalid token ID');

            let caller = get_caller_address();
            assert(caller == self.owner_of(token_id), 'ERC721: Caller is not owner');
            assert(to.is_non_zero(), 'ERC721: transfer to 0 address');

            self.token_approvals.write(token_id, Zeroable::zero());

            self.balances.write(caller, self.balances.read(caller) - 1.into());
            self.balances.write(to, self.balances.read(to) + 1.into());

            self.owners.write(token_id, to);

            self.emit(
                Transfer{ from: caller, to: to, token_id: token_id }
            );
        }

       
        fn burn(ref self: ContractState, token_id: u256) {
            assert(self._exists(token_id), 'ERC721: invalid token ID');

            let caller = get_caller_address();
            let owner = self.owner_of(token_id);
            assert(caller == owner, 'ERC721: Caller is not owner');

            self.token_approvals.write(token_id, Zeroable::zero());

            let owner_balance = self.balances.read(owner);
            self.balances.write(owner, owner_balance - 1.into());

            self.owners.write(token_id, Zeroable::zero());
            self.emit(
                Transfer{ from: owner, to: Zeroable::zero(), token_id: token_id }
            );
        }



        fn update_l1_address(ref self: ContractState, _l1_address: felt252) {
            let caller = get_caller_address();
            assert(caller == self.contract_owner.read(), 'Caller is not contract owner');
            self.l1_address.write(_l1_address);
        }


    }
}