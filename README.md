<img src="https://github.com/keyllli223/CrossChainGEMs/assets/84118397/742d463e-e6f0-4432-9db6-cbf2dd75153c" width="300px">

## Cross Chain GEMs - powered by AXELAR & Starknet L2 → L1 messaging

----

- Live demo app: https://axelar-game.netlify.app/
- Video: https://youtu.be/kf7yZbHLtyg

----

The idea of this dApp is that users can mint NFTs on diffents EVM chains and bridge them only to AVAX. So after, for each different NFT item from different chain, user can improve some skill of his NPC from AVAX. 

Like bridge a NFT (in game item) from MATIC to AVAX and get +50 coins.
Or Bridge another item (from Fantom) to AVAX and get special skill.



## ⭐⭐ APPLIED FOR BOUNTIES: ⭐⭐

### 1️⃣ **"AXELAR - $4,000"**

### 2️⃣ **"STARKWARE - $4,500"**

### 3️⃣ **"AVALANCHE - $5,000"**

--------

## Description how I use:

## 1️⃣ AXELAR:  Using Axelar GMP for sending Interchain Messages
- **AxelarScan link with a completed Interchain transaction:**
    - **Fantom Testnet** → **Avalanche Testnet** (bridge NFT): https://testnet.axelarscan.io/gmp/0x653996de9cdc4759a7420513a9fca475b922e12ac4cc43297bab731750472309
    - **Polygon Testnet** → **Avalanche Testnet** (bridge NFT): https://testnet.axelarscan.io/gmp/0x262ae6ada2cf1e1f4a3957f5cccfb1ce5a2e1d691c609179a0f51ffabf2c29f0
- **Experiences I had with learning and using Axelar:**
  - Was very interesting to connect in this way multiple chains. That can also bring new users from different chains and play in a realy INTERCHAIN game.
  - Even I use the testnet, was sometime hard to find test gas tokens for bridge  😆 😆😆 . Its just a fun fact. 
  - Will continue to integrate non EVM chains. Like cosmos, and others. Really good infrastructure project. Thank you Axelar for such experience !

------

### 2️⃣ STARKWARE - $4,500:  L2  → L1 communication

I created a bridgeable NFT collection (ERC721) on Starknet Goerli. 

Contract: `0x03dc5a1ed0df3b7b655c2170ef443e42ff214b9193707d5ebd0565eb03ab319b`. 

Explorer: https://goerli.voyager.online/contract/0x03dc5a1ed0df3b7b655c2170ef443e42ff214b9193707d5ebd0565eb03ab319b

I used **L2  → L1 communication** (Starknet Goerli → ETH Goerli) for bridging NFTs from Starknet to Goerli.

Few example of L2 → L1 messages:
- Msg 1: https://goerli.voyager.online/message/0xc4de415e78575d00bbee0e8f8d4a1eeb5a5b6294e71e3ff87006145a3c671358
- Msg 2: https://goerli.voyager.online/message/0x7653a0676f63faa534b2704fcd42d4c758705b29ec09aae7738377479cdcac54

Contract on Goerli for bridged NFTs from Starknet: 
- https://goerli.etherscan.io/address/0xe7c354bb5cba813ff8b9725c10d0df35518e20be

Proof of claiming NFT on L1 (Goerli) [using function ConsumedMessageToL1)
- https://goerli.etherscan.io/tx/0x887297a77b9b1c114d8368ba9b652f1e165b15a0f60214b785fae3a97d823be6

**The process:**
1. User mint a NFT on Starknet Goerli;
2. User bridge the NFT to L1 (Goerli)
3. User wait some time until transaction is attached to L1 (~5 hours)
4. User claim manually the NFT on Goerli
5. Done ! But in my project, the NFT bridged from Starknet to Goerli can also be bridged to Avalanche Testnet, using Axelar GMP.

So the path is: Starknet -> Goerli -> Avalanche

 
----

### 3️⃣ AVALANCHE - $5,000:   EVM C-Chain Track

All EVM collections are bridged to AVAX Fuji EVM C-Chain & users sell owned NFTs for some AVAX.

Few contracts deployed on AVAX Fuji:
- https://testnet.snowtrace.io/address/0x0874fc46009698d2bf200ca2fc3cba5bb1b87cff
- https://testnet.snowtrace.io/address/0x8cf7132a823d4b998c9bfe46b9de6d3a6f0cfad6

----

Gamefi dApp that demonstrate the power of Axelar infrastructure.

That can brings users from differents chains to join in one place.

Much chains used, EVM, Starknet, Cosmos.


====================================

## Demo images:


![image](https://github.com/keyllli223/CrossChainGEMs/assets/84118397/04f068c9-b733-4615-87b9-5bde693273d6)

![image](https://github.com/keyllli223/CrossChainGEMs/assets/84118397/1faa295c-05ea-41f7-ba5c-c6cc60e19d31)

