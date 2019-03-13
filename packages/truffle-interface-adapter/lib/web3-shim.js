const Web3 = require("web3");

const ethereumOverloads = require("./ethereum-overloads");
const quorumOverloads = require("./quorum-overloads");
const AxCoreProviderExtension = require("./axcore-provider-extension");

// This is a temporary shim to support the basic issues with Quorum

class Web3Shim extends Web3 {
  constructor(options) {
    super();

    if (options) {
      this.networkType = options.networkType || "ethereum";

      if (options.provider) {
        this.setProvider(options.provider);
      }
    } else {
      this.networkType = "ethereum";
    }

    this.initInterface();
  }

  setProvider(provider) {
    switch (this.networkType) {
      case "axcore": {
        provider = new AxCoreProviderExtension(provider);
        break;
      }
      case "quorum":
      case "ethereum":
      default: {
        break;
      }
    }

    super.setProvider(provider);
  }

  setNetworkType(networkType) {
    this.networkType = networkType;
    this.initInterface();
  }

  initInterface() {
    switch (this.networkType) {
      case "quorum": {
        this.initQuorum();
        break;
      }
      case "axcore":
      case "ethereum":
      default: {
        this.initEthereum();
        break;
      }
    }
  }

  initEthereum() {
    // truffle has started expecting gas used/limit to be
    // hex strings to support bignumbers for other ledgers
    ethereumOverloads.getBlock(this);
    ethereumOverloads.getTransaction(this);
    ethereumOverloads.getTransactionReceipt(this);
  }

  initQuorum() {
    // duck punch some of web3's output formatters
    quorumOverloads.getBlock(this);
    quorumOverloads.getTransaction(this);
    quorumOverloads.getTransactionReceipt(this);
  }

  hasContractOptions() {
    return this.networkType === "axcore";
  }

  registerNewContract(bytecode, options) {
    // we're creating a new contract with this bytecode
    // we should watch for this bytecode, and process
    // options accordingly. once it's deployed, we can
    // associate an address to the options.
  }
}

module.exports = Web3Shim;
