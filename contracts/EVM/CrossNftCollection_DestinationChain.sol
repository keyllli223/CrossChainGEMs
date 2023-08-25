// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";

contract NftContractDestination is AxelarExecutable, ERC721, ERC721Enumerable, ERC721URIStorage {
    address private relayer;
    address private contractOwner;
    uint256 private _tokenIds;
    string public collectionURI;
    string public sourceChain;
    uint256 public rewardAmount;

    constructor(
        string memory collectionURI_, 
        string memory sourceChain_, 
        address gateway_,
        uint256 rewardAmount_
    ) ERC721("NFT Contract Destination", "NFT") AxelarExecutable(gateway_) {
        collectionURI = collectionURI_;
        contractOwner = msg.sender;
        sourceChain = sourceChain_;
        rewardAmount = rewardAmount_;
    }

    function _execute(
        string calldata,
        string calldata,
        bytes calldata payload_
    ) internal override {
        (string memory sourceChain_, address sourceAddress_, uint256 tokenId_, string memory tokenURI_) = abi.decode(
            payload_,
            (string, address, uint256, string)
        );

        _mint(sourceAddress_, tokenId_);
        _setTokenURI(tokenId_, tokenURI_);
    }
       
    receive() external payable  {}
    fallback() external payable {}

    function getReward(uint256 tokenId) public {
        super._burn(tokenId);
        payable(msg.sender).transfer(rewardAmount);
    }


    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Caller is not owner");
        _;
    }
    
    


    
    // The following functions are overrides required by Solidity.

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