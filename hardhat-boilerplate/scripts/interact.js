const { ethers } = require('ethers');


const contractArtifact = require("../frontend/src/contracts/Agent.json");


const contractAddress = require("../frontend/src/contracts/path-agent-contract-address.json");

const provider1 = new ethers.providers.JsonRpcProvider("https://devnet.galadriel.com");

const wallet1 = new ethers.Wallet("0xf0e1b1c8270d61429bd547c0c2e7d0fa80f2b9abd944b5efe409f0ae69584385", provider1);

var contract = new ethers.Contract(
    contractAddress.contract,
    contractArtifact.abi,
    wallet1
);

var res = await contract.runAgent("1. **Story Opening:** In the heart of a frostbitten forest, where the trees whispered secrets beneath a blanket of endless winter, the kingdom of Eversnow stood, isolated from the world by a charm as old as time. At the center of this kingdom, veiled by the silhouette of towering spires and ice-kissed battlements, was a castle as haunting as it was beautiful. Within its walls lived Queen Isolde, famed not just for her realm's unyielding winters, but for her unmatched beauty—a beauty she preserved through dark enchantments and a heart grown cold with jealousy. One stormy evening, as the wind howled its lonesome tune, Isolde stood before her magical mirror, its surface swirling with mystic smoke. \"Mirror, mirror, on the wall, who's the fairest of them all?\" she asked, her voice a melody of silken ice. The mirror's mist cleared, revealing not her own reflection, but the image of a young maiden, her skin as pure as the snow outside, with lips red as rose, and hair black as ebony—Princess Snow White, Isolde’s stepdaughter. [Thought: Queen Isolde] Fear and rage twisted in her heart like a knotted vine. How could this child overshadow her, the queen of Eversnow? [Dialogue: Queen Isolde] \"This cannot be,\" she whispered, a storm brewing in her eyes. \"The kingdom shall have but one queen of beauty.\" Through the icy halls of the castle and beyond, into the soul of the forest that held secrets of its own, Snow White's fate was to be entwined with that of seven dwarfs, an enchanted apple, and a love destined to break the coldest of curses. Thus begins the tale of betrayal and redemption, where the true power lies not in the beauty that the eyes can see, but in the resilience of a pure heart and the courage to rewrite one’s destiny. 2. **Brief explanation:** This opening sets the scene in a magical, winter-bound kingdom, introducing the main characters—Queen Isolde and her stepdaughter, Snow White, through the iconic mirror scene, but with added depth to the queen's motivations and feelings. It hints at the forthcoming journey, involving classic elements like the seven dwarfs and an enchanted apple, while promising a story of betrayal, redemption, and true beauty. This aligns with the user's request by reimagining the classic Snow White story in a way that immediately immerses the reader into its fantastical world, setting the tone for a deeper exploration of well-known characters and themes.", 3);
// contract.setOracleAddress("0x0352b37E5680E324E804B5A6e1AddF0A064E201D");

var res = await contract.getMessageHistoryContents(0);
var res = await contract.getMessageHistoryRoles(0);