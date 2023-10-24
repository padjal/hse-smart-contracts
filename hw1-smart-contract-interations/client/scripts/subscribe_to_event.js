const { Web3 } = require("web3");

// Loading the contract ABI
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("./Bank.json"));

async function main(){
    const network = process.env.ETHEREUM_NETWORK;
    const web3 = new Web3(
        new Web3.providers.HttpProvider(
            `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`,
        ),
    );

    // Creating a signing account from a private key
    const signer = web3.eth.accounts.privateKeyToAccount(
        "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    web3.eth.accounts.wallet.add(signer);

    // Using the signing account to deploy the contract
    const contract = new web3.eth.Contract(abi, process.env.BANK_CONTRACT);

    // contract.once('allEvents', {
    //     fromBlock: 0
    // }, function(error, event){
    //     console.log(event);
    // })

    contract.events.ClientAdded({
        fromBlock: 0
    }, function(error, event){ console.log(event); })
    .on("connected", function(subscriptionId){
        console.log(subscriptionId);
    })
    .on('data', function(event){
        console.log(event); // same results as the optional callback above
    })
    .on('changed', function(event){
        // remove event from local database
    })
    .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log('An error occured.');
    });

    //contract.events.allEvents((error))

    // contract.events.allEvents({
    //     fromBlock: 'latest'
    // }, function(error, event){  })
    //     .on('data', function(event){
    //         console.log('hello event ',event);
    //     })
    //     .on('error', console.error);

    // web3.eth.subscribe('allEvents', {
    //     address: process.env.BANK_CONTRACT,
    //     topics: ['0x30de532d31dad2547b9fd8eb6ea21664d9fb3b420c2ba20691048cf88ad54874',
    // '0x0000000000000000000000000000000000000000000000000000000000000001']
    // }, function(error, result){
    //     if (!error)
    //         console.log(result);
    // });
}

require("dotenv").config();
main();

//wss://sepolia.infura.io/ws/v3/a4ac754de990482cae9598cf6c13173d
//wss://sepolia.infura.io/ws/v3/a4ac754de990482cae9598cf6c13173d
//wss://sepolia.infura.io/ws/v3/a4ac754de990482cae9598cf6c13173d