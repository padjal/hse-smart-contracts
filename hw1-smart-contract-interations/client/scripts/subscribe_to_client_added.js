const { Web3 } = require("web3");

// Loading the contract ABI
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("./Bank.json"));

const subscribeLogEvent = (contract, eventName) => {
    const eventJsonInterface = Web3.utils._.find(
      contract._jsonInterface,
      o => o.name === eventName && o.type === 'event',
    )
    const subscription = Web3.eth.subscribe('logs', {
      address: contract.options.address,
      topics: [eventJsonInterface.signature]
    }, (error, result) => {
      if (!error) {
        const eventObj = Web3.eth.abi.decodeLog(
          eventJsonInterface.inputs,
          result.data,
          result.topics.slice(1)
        )
        console.log(`New ${eventName}!`, eventObj)
      }
    })
    subscribedEvents[eventName] = subscription
  }

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

    
    contract.getPastEvents('ClientAdded').then(console.log);
}

require("dotenv").config();
main();