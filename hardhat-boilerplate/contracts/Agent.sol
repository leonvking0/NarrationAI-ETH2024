// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IOracle {

    struct Content {
        string contentType;
        string value;
    }

    struct Message {
        string role;
        Content [] content;
    }

    struct OpenAiRequest {
        // "gpt-4-turbo", "gpt-4-turbo-preview" or "gpt-3.5-turbo-1106"
        string model;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 frequencyPenalty;
        // JSON string or empty string
        string logitBias;
        // 0 for null
        uint32 maxTokens;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 presencePenalty;
        // JSON string or empty string
        string responseFormat;
        // 0 for null
        uint seed;
        // empty str for null
        string stop;
        // 0-20, > 20 for null
        uint temperature;
        // 0-100  percentage, > 100 for null
        uint topP;
        // JSON list for tools in OpenAI format, empty for null, names have to match the supported tools
        string tools;
        // "none", "auto" or empty str which defaults to auto on OpenAI side
        string toolChoice;
        string user;
    }

    struct OpenAiResponse {
        string id;

        // either content is an empty str or functionName and functionArguments
        string content;
        string functionName;
        string functionArguments;

        uint64 created;
        string model;
        string systemFingerprint;
        // kind of pointless since its always "chat.completion"?
        string object;

        uint32 completionTokens;
        uint32 promptTokens;
        uint32 totalTokens;
    }

    struct GroqRequest {
        // "llama3-8b-8192", "llama3-70b-8192", "mixtral-8x7b-32768" or "gemma-7b-it"
        string model;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 frequencyPenalty;
        // JSON string or empty string
        string logitBias;
        // 0 for null
        uint32 maxTokens;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 presencePenalty;
        // JSON string or empty string
        string responseFormat;
        // 0 for null
        uint seed;
        // empty str for null
        string stop;
        // 0-20, > 20 for null
        uint temperature;
        // 0-100  percentage, > 100 for null
        uint topP;
        string user;
    }

    struct GroqResponse {
        string id;

        string content;

        uint64 created;
        string model;
        string systemFingerprint;
        // kind of pointless since its always "chat.completion"?
        string object;

        uint32 completionTokens;
        uint32 promptTokens;
        uint32 totalTokens;
    }

    struct LlmRequest {
        // "claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307", "claude-2.1", "claude-2.0", "claude-instant-1.2"
        string model;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 frequencyPenalty;
        // JSON string or empty string
        string logitBias;
        // 0 for null
        uint32 maxTokens;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 presencePenalty;
        // JSON string or empty string
        string responseFormat;
        // 0 for null
        uint seed;
        // empty str for null
        string stop;
        // 0-20, > 20 for null
        uint temperature;
        // 0-100  percentage, > 100 for null
        uint topP;
        // JSON list for tools in OpenAI format, empty for null, names have to match the supported tools
        string tools;
        // "none", "auto" or empty str which defaults to auto on OpenAI side
        string toolChoice;
        string user;
    }

    struct LlmResponse {
        string id;

        // either content is an empty str or functionName and functionArguments
        string content;
        string functionName;
        string functionArguments;

        uint64 created;
        string model;
        string systemFingerprint;
        // kind of pointless since its always "chat.completion"?
        string object;

        uint32 completionTokens;
        uint32 promptTokens;
        uint32 totalTokens;
    }


    struct KnowledgeBaseQueryRequest {
        string cid;
        string query;
        uint32 num_documents;
    }

    function createLlmCall(
        uint promptId
    ) external returns (uint);

    function createLlmCall(
        uint promptId,
        LlmRequest memory request
    ) external returns (uint);

    function createGroqLlmCall(
        uint promptId,
        GroqRequest memory request
    ) external returns (uint);

    function createOpenAiLlmCall(
        uint promptId,
        OpenAiRequest memory request
    ) external returns (uint);

    function createFunctionCall(
        uint functionCallbackId,
        string memory functionType,
        string memory functionInput
    ) external returns (uint i);

    function createKnowledgeBaseQuery(
        uint kbQueryCallbackId,
        string memory cid,
        string memory query,
        uint32 num_documents
    ) external returns (uint i);
}

contract Agent {

    string public prompt;

    struct Message {
        string role;
        string content;
    }

    struct AgentRun {
        address owner;
        Message[] messages;
        uint responsesCount;
        uint8 max_iterations;
        bool is_finished;
    }

    mapping(uint => AgentRun) public agentRuns;
    uint private agentRunCount;

    event AgentRunCreated(address indexed owner, uint indexed runId);

    address private owner;
    address public oracleAddress;

    event OracleAddressUpdated(address indexed newOracleAddress);

    IOracle.OpenAiRequest private config;

    constructor(
        address initialOracleAddress,
        string memory systemPrompt
    ) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        prompt = systemPrompt;

        config = IOracle.OpenAiRequest({
            model : "gpt-4-turbo-preview",
            frequencyPenalty : 21, // > 20 for null
            logitBias : "", // empty str for null
            maxTokens : 1000, // 0 for null
            presencePenalty : 21, // > 20 for null
            responseFormat : "{\"type\":\"text\"}",
            seed : 0, // null
            stop : "", // null
            temperature : 10, // Example temperature (scaled up, 10 means 1.0), > 20 means null
            topP : 101, // Percentage 0-100, > 100 means null
            tools : "[{\"type\":\"function\",\"function\":{\"name\":\"web_search\",\"description\":\"Search the internet\",\"parameters\":{\"type\":\"object\",\"properties\":{\"query\":{\"type\":\"string\",\"description\":\"Search query\"}},\"required\":[\"query\"]}}},{\"type\":\"function\",\"function\":{\"name\":\"image_generation\",\"description\":\"Generates an image using Dalle-2\",\"parameters\":{\"type\":\"object\",\"properties\":{\"prompt\":{\"type\":\"string\",\"description\":\"Dalle-2 prompt to generate an image\"}},\"required\":[\"prompt\"]}}}]",
            toolChoice : "auto", // "none" or "auto"
            user : "" // null
        });
    }

    function resetPrompt(string memory _prompt) public onlyOwner {
        prompt = _prompt;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        require(msg.sender == owner, "Caller is not the owner");
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function runAgent(string memory query, uint8 max_iterations) public returns (uint i) {
        AgentRun storage run = agentRuns[agentRunCount];

        run.owner = msg.sender;
        run.is_finished = false;
        run.responsesCount = 0;
        run.max_iterations = max_iterations;

        Message memory systemMessage;
        systemMessage.content = prompt;
        systemMessage.role = "system";
        run.messages.push(systemMessage);

        Message memory newMessage;
        newMessage.content = query;
        newMessage.role = "user";
        run.messages.push(newMessage);

        uint currentId = agentRunCount;
        agentRunCount = agentRunCount + 1;

        IOracle(oracleAddress).createOpenAiLlmCall(currentId, config);
        emit AgentRunCreated(run.owner, currentId);

        return currentId;
    }

    function onOracleOpenAiLlmResponse(
        uint runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];

        if (!compareStrings(errorMessage, "")) {
            Message memory newMessage;
            newMessage.role = "assistant";
            newMessage.content = errorMessage;
            run.messages.push(newMessage);
            run.responsesCount++;
            run.is_finished = true;
            return;
        }
        if (run.responsesCount >= run.max_iterations) {
            run.is_finished = true;
            return;
        }
        if (!compareStrings(response.content, "")) {
            Message memory assistantMessage;
            assistantMessage.content = response.content;
            assistantMessage.role = "assistant";
            run.messages.push(assistantMessage);
            run.responsesCount++;
        }
        if (!compareStrings(response.functionName, "")) {
            IOracle(oracleAddress).createFunctionCall(runId, "image_generation", response.functionArguments);
            return;
        }
        run.is_finished = true;
    }

    function onOracleFunctionResponse(
        uint runId,
        string memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];
        require(
            !run.is_finished, "Run is finished"
        );
        string memory result = response;
        if (!compareStrings(errorMessage, "")) {
            result = errorMessage;
        }
        Message memory newMessage;
        newMessage.role = "user";
        string memory _content = string.concat(result, ";image generation finished, now continue to write the story.");
        newMessage.content = _content;
        run.messages.push(newMessage);
        run.responsesCount++;
        IOracle(oracleAddress).createOpenAiLlmCall(runId, config);
    }

    function getMessageHistoryContents(uint agentId) public view returns (string[] memory) {
        string[] memory messages = new string[](agentRuns[agentId].messages.length);
        for (uint i = 0; i < agentRuns[agentId].messages.length; i++) {
            messages[i] = agentRuns[agentId].messages[i].content;
        }
        return messages;
    }

    function getMessageHistoryRoles(uint agentId) public view returns (string[] memory) {
        string[] memory roles = new string[](agentRuns[agentId].messages.length);
        for (uint i = 0; i < agentRuns[agentId].messages.length; i++) {
            roles[i] = agentRuns[agentId].messages[i].role;
        }
        return roles;
    }

    function isRunFinished(uint runId) public view returns (bool) {
        return agentRuns[runId].is_finished;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
