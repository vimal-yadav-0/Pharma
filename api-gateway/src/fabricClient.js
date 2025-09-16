const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const ccpPath = process.env.CONNECTION_PROFILE;
const walletPath = process.env.WALLET_PATH;
const userId = process.env.USER_ID;
const channelName = process.env.CHANNEL_NAME;
const chaincodeName = process.env.CHAINCODE_NAME;

async function getContract() {
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: userId,
    discovery: { enabled: true, asLocalhost: true }
  });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  return { contract, gateway };
}

async function submitTransaction(fn, ...args) {
  const { contract, gateway } = await getContract();
  try {
    const result = await contract.submitTransaction(fn, ...args);
    return result.toString();
  } finally {
    gateway.disconnect();
  }
}

async function evaluateTransaction(fn, ...args) {
  const { contract, gateway } = await getContract();
  try {
    const result = await contract.evaluateTransaction(fn, ...args);
    return result.toString();
  } finally {
    gateway.disconnect();
  }
}

module.exports = { submitTransaction, evaluateTransaction };
