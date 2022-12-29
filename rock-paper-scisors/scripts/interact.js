const hre = require("hardhat");

// scripts/index.js
async function main () {
    const contractAddress = "0xE7D0ad4b9696df1470a22Ea41F3F7BAB9d6377BF";
    const rpsContract = await hre.ethers.getContractAt("rps", contractAddress);

    console.log(rpsContract.player1());
  }
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});