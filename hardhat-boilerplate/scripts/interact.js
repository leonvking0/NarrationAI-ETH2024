const { ethers } = require('ethers');


const contractArtifact = require("../frontend/src/contracts/Agent.json");


const contractAddress = require("../frontend/src/contracts/agent-contract-address.json");

const provider1 = new ethers.providers.JsonRpcProvider("https://devnet.galadriel.com");

const wallet1 = new ethers.Wallet("0xf0e1b1c8270d61429bd547c0c2e7d0fa80f2b9abd944b5efe409f0ae69584385", provider1);

var contract = new ethers.Contract(
    contractAddress.contract,
    contractArtifact.abi,
    wallet1
);

var res = await contract.runAgent("write a story of what happens if Napolean won the battle of Waterloo", 4);
// contract.setOracleAddress("0x0352b37E5680E324E804B5A6e1AddF0A064E201D");

var res = await contract.getMessageHistoryContents(0);
var res = await contract.getMessageHistoryRoles(0);