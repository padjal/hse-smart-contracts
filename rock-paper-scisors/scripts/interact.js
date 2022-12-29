const { ethers } = require("hardhat");
const hre = require("hardhat");

// scripts/index.js
async function main () {
    const contractAddress = "0xA9331D18951Ae8ae95dA7Fa23f06E7FeF072A296";
    const RPS = await ethers.getContractFactory('RPS');
    const rps = await RPS.attach(contractAddress);

    console.log(rps.player1_choice());
  }
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});