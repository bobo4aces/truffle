const Web3 = require("web3");

const ethereumOverloads = require("./ethereum-overloads");
const quorumOverloads = require("./quorum-overloads");

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
}

module.exports = Web3Shim;
