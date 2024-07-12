const { ethers } = require('ethers');


const ChatSingleArtifact = require("../frontend/src/contracts/ChatSingle.json");


const chatSingleContractAddress = require("../frontend/src/contracts/chat-contract-address.json");

const provider1 = new ethers.providers.JsonRpcProvider("https://devnet.galadriel.com");

const wallet1 = new ethers.Wallet("0xf0e1b1c8270d61429bd547c0c2e7d0fa80f2b9abd944b5efe409f0ae69584385", provider1)

var contract = new ethers.Contract(
    chatSingleContractAddress.ChatSingle,
    ChatSingleArtifact.abi,
    wallet1
)

var messageContents = await contract.getMessageHistoryContents(0);
