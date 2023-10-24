const { Web3 } = require("web3");

// Loading the contract ABI
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("./Bank.json"));

async function main() {
    const network = process.env.ETHEREUM_NETWORK;
    const web3 = new Web3(
        new Web3.providers.HttpProvider(
            `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`,
        ),
    );

    // Creating a Contract instance
    const contract = new web3.eth.Contract(
        abi,
        process.env.BANK_CONTRACT,
        );

    contract.getPastEvents(
      'allEvents',{
  fromBlock: 0,
  toBlock: 'latest'
      }).then(console.log)
}

require("dotenv").config();
main();