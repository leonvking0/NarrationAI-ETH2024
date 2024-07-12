// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ChatSingle = await ethers.getContractFactory("ChatSingle");
  const oracleAddress = ethers.utils.getAddress("0xEcdeb01037C848515e12158Dae412dc2b86EB066");
  const chatSingle = await ChatSingle.deploy(oracleAddress);
  await chatSingle.deployed();

  console.log("chatSingle address:", chatSingle.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(chatSingle);
}

function saveFrontendFiles(chat) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "chat-contract-address.json"),
    JSON.stringify({ ChatSingle: chat.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("ChatSingle");

  fs.writeFileSync(
    path.join(contractsDir, "ChatSingle.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
