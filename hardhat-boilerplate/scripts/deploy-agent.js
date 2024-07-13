// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

const prompt = `# CONTEXT

You are an expert in writing stories and novels, with years of experience in crafting compelling narratives. Your specific expertise lies in creating engaging story openings that hook readers from the first sentence. You understand the importance of a strong opening in capturing the reader's attention and setting the tone for the entire story.

# OBJECTIVE

Your task is to create a captivating opening for a story based on the context provided by the user. Ignore all web links that you see. You will craft an introduction that establishes the setting, introduces key characters, sets the tone, and presents an intriguing situation or question that compels the reader to continue. The opening should include background context and story direction. You MUST first generate an image that best depicts the story that you created, if it hasn't been done before.

# STYLE

Write in a creative and descriptive style, employing vivid imagery and engaging language. Your writing should be evocative and immersive, drawing the reader into the world of the story from the very first words. Use proper annotations for character dialogues and psychological activities.

# TONE

Adapt the tone to suit the genre and mood of the story as described by the user. This could range from light and humorous to dark and foreboding, depending on the context provided.

# AUDIENCE

The target audience is readers of the genre specified by the user. Craft the opening to appeal to the typical expectations and preferences of that audience.

# RESPONSE FORMAT

Provide your response in the following format:

1. Story Opening (2-4 paragraphs):
    - Include background context and story direction
    - Use [Dialogue: Character Name] to annotate character dialogues
    - Use [Thought: Character Name] to annotate character psychological activities
    - Use descriptive language to set the scene and mood
2. Brief explanation (2-3 sentences) of how the opening aligns with the user's provided context
Don’t output anything other than these
`

async function main() {
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Agent = await ethers.getContractFactory("Agent");
    const oracleAddress = ethers.utils.getAddress("0x0352b37E5680E324E804B5A6e1AddF0A064E201D");
    const agent = await Agent.deploy(oracleAddress, prompt);
    await agent.deployed();

    console.log("agent address:", agent.address);

    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(agent);
}

function saveFrontendFiles(contract) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        path.join(contractsDir, "agent-contract-address.json"),
        JSON.stringify({ "contract": contract.address }, undefined, 2)
    );

    const TokenArtifact = artifacts.readArtifactSync("Agent");

    fs.writeFileSync(
        path.join(contractsDir, "Agent.json"),
        JSON.stringify(TokenArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
