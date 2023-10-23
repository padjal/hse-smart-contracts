var { Web3 } = require("web3");
require('dotenv').config();
const INFURA_SEPOLIA_ENDPOINT = process.env.INFURA_SEPOLIA_ENDPOINT;

console.log(INFURA_SEPOLIA_ENDPOINT);

var provider = INFURA_SEPOLIA_ENDPOINT;
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);
web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ", result);
});