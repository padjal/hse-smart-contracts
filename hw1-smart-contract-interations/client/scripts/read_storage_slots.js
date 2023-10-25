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
    const contract = new web3.eth.Contract(abi, process.env.BANK_CONTRACT);

    for(let i=0; i<4; i++){
        let storage = await web3.eth.getStorageAt(process.env.BANK_CONTRACT, i);
        console.log(`Storage slot ${i}: ${storage}}`);

        console.log(`DEC: ${web3.utils.toDecimal(storage)}\n`);
    }
    
}

require("dotenv").config();
main();
