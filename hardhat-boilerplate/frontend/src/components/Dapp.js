import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers

import ChatSingleArtifact from "../contracts/ChatSingle.json";
import chatSingleContractAddress from "../contracts/chat-contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import Home from "./pages/Home";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Layout/Navbar";
import ThreadHome from "./ThreadHome";
import { LogoAndWelcome } from "./views/LogoAndWelcome";

// This is the default id used by the Hardhat Network
const GALADRIEL_NETWORK_ID = "696969";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      waitingResult: false,
      chatId: 0,
      inputPrompt: undefined,
      llmResponse: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install a wallet.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If everything is loaded, we render the application.
    return (
      <div className="dapp">
        <Router>
          {/*<NavBar />*/}
          {/*<div className="row">*/}
          {/*  <div className="col-12">*/}
          {/*    <p>*/}
          {/*      Welcome <b>{this.state.selectedAddress}</b>!*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <LogoAndWelcome user={this.state.selectedAddress} />

          <div className="row">
            <div className="col-12">
              {/*
              Sending a transaction isn't an immediate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
              {this.state.txBeingSent && (
                <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
              )}

              {/*
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
              {this.state.transactionError && (
                <TransactionErrorMessage
                  message={this._getRpcErrorMessage(
                    this.state.transactionError,
                  )}
                  dismiss={() => this._dismissTransactionError()}
                />
              )}
            </div>
          </div>

          <Routes>
            <Route
              path="/"
              exact
              element={
                <Home
                  props={{
                    selectedAddress: this.state.selectedAddress,
                    balance: this.state.balance,
                    txBeingSent: this.state.txBeingSent,
                    transactionError: this.state.transactionError,
                    _dismissTransactionError: () => this._dismissNetworkError(),
                    _pay: (prompt) => this._pay(prompt),
                    waitingResult: this.state.waitingResult,
                    llmResponse: this.state.llmResponse,
                    type: "/",
                  }}
                />
              }
            />
            <Route
              path="/threads"
              exact
              element={<ThreadHome type="/threads" />}
            />
            <Route
              path="/favourate"
              exact
              element={<ThreadHome type="/favourate" />}
            />
            <Route
              path="/useful"
              exact
              element={<ThreadHome type="/useful" />}
            />
          </Routes>
        </Router>
      </div>
    );
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _pay(prompt) {
    try {
      console.log("entering pay function");
      this._dismissTransactionError();
      const options = {};
      this.setState({ prompt: prompt });
      const tx = await this._contract.startChat(prompt, options);

      const receipt = await tx.wait();
      const event = receipt.events.find(
        (event) => event.event === "ChatCreated",
      );
      const [_sender, _chatId] = event.args;
      this.setState({
        txBeingSent: tx.hash,
        inputPrompt: prompt,
        llmResponse: undefined,
        chatId: _chatId,
        waitingResult: true,
      });

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    // First we check the network
    this._checkNetwork();

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    // listen to contract llmResponse event
    // this._contract.on(
    //   "LLMReplied",
    //   async (_chatId, _response) => {
    //     console.log(
    //       "see a result event: ",
    //       _chatId,
    //       "expecting result for chat: ",
    //       this.state.chatId
    //     );
    //     if (typeof this.state.chatId !== "undefined") {
    //       if (_chatId.eq(this.state.chatId)) {
    //         console.log("see result for job: ", _chatId);
    //         this.setState({ llmResponse: _response, waitingResult: false });
    //         console.log("changed llmResponse field to: ", _response);
    //       }
    //     }
    //   }
    // );
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._initializeEthers();
    this._startPollingData();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    this._contract = new ethers.Contract(
      chatSingleContractAddress.ChatSingle,
      ChatSingleArtifact.abi,
      this._provider.getSigner(0),
    );
  }

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(
      () => this._checkMessageContents(),
      1000,
    );

    // We run it once immediately so we don't have to wait for it
    this._checkMessageContents();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  async _checkMessageContents() {
    if (this.state.chatId) {
      try {
        const messageContents = await this._contract.getMessageHistoryContents(
          this.state.chatId,
        );
        if (messageContents.length >= 2) {
          this.setState({
            llmResponse: messageContents[1],
            waitingResult: false,
          });
        }
      } catch (error) {}
    }
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  async _switchChain() {
    const chainIdHex = `0x${GALADRIEL_NETWORK_ID.toString(16)}`;
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await this._initialize(this.state.selectedAddress);
  }

  // This method checks if the selected network is Localhost:8545
  _checkNetwork() {
    if (window.ethereum.networkVersion !== GALADRIEL_NETWORK_ID) {
      this._switchChain();
    }
  }
}
