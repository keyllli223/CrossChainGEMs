// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

interface ISolution {
    function consumeMessage(uint256 l2ContractAddress, uint256 l2User) external;
}

interface IStarknetCore {
    function consumeMessageFromL2(uint256 fromAddress, uint256[] calldata payload)
        external
        returns (bytes32);

    function l2ToL1Messages(bytes32 msgHash) external view returns (uint256);
}

contract NftBridgedFromStarknet is Ownable, AxelarExecutable, ERC721, ERC721Enumerable, ERC721URIStorage{
    IStarknetCore private starknetCore;
    uint256 public l2Contract;

    IAxelarGasService public immutable gasService;
    uint256 private _tokenIds;
    string public collectionURI;

    string public sourceChain;
    string public destinationChain;
    string public destinationAddress;
    address private contractOwner;

    constructor(
        string memory collectionURI_, 
        string memory sourceChain_, 
        string memory destinationChain_, 
        string memory destinationAddress_, 
        address gateway_, 
        address gasService_,
        address starknetCore_
    ) ERC721("NFT Contract Starknet", "NFT") AxelarExecutable(gateway_) {
        contractOwner = msg.sender;
        collectionURI = collectionURI_;
        sourceChain = sourceChain_;
        destinationChain = destinationChain_;
        destinationAddress = destinationAddress_;
        starknetCore = IStarknetCore(starknetCore_);
        gasService = IAxelarGasService(gasService_);
    }

    function sendNFT(uint256 tokenId) external payable {
        address owner_ = _ownerOf(tokenId);
        string memory tokenURI_ = tokenURI(tokenId);
        bytes memory payload = abi.encode(sourceChain, owner_, tokenId, tokenURI_);
        _burn(tokenId);

        gasService.payNativeGasForContractCall{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );
        gateway.callContract(destinationChain, destinationAddress, payload);    
    }

    function claimNFT(uint256 tokenId) external payable{
        require(msg.value>=10000000000, "Message fee missing");
        uint256[] memory payload = new uint256[](1);
        payload[0] = tokenId;
        starknetCore.consumeMessageFromL2(l2Contract, payload);

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, collectionURI);
    }

    function setL2Contract(uint256 l2Contract_) external onlyContractOwner {
        l2Contract = l2Contract_;
    }

    function setDestinationAddress(string memory destinationAddress_) external onlyContractOwner {
        destinationAddress = destinationAddress_;
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Caller is not owner");
        _;
    }


    // Override functions

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}