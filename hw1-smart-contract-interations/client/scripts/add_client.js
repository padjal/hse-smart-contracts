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

    // Creating a signing account from a private key
    const signer = web3.eth.accounts.privateKeyToAccount(
        "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    web3.eth.accounts.wallet.add(signer);

    // Creating a Contract instance
    const contract = new web3.eth.Contract(
    abi,
    process.env.BANK_CONTRACT,
    );

    const method_abi = contract.methods.addClient("Peter", 23, 2).encodeABI();
    const tx = {
        from: signer.address,
        to: contract.options.address,
        data: method_abi,
        value: '0',
        gasPrice: '100000000000',
    };

    const gas_estimate = await web3.eth.estimateGas(tx);
    tx.gas = gas_estimate;
    const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
    console.log("Raw transaction data: " + ( signedTx).rawTransaction);

    // Sending the transaction to the network
    const receipt = await web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .once("transactionHash", (txhash) => {
    console.log(`Mining transaction ...`);
    console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
}

require("dotenv").config();
main();
