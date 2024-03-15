const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("KittenRaffle", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
      const [feeAddress ] = await ethers.getSigners();

      const entranceFee = 500;        // fee to enter raffle in wei
      const raffleDuration = 360;     // duration of raffle in seconds
      const KittenRaffle = await ethers.deployContract(
        "KittenRaffle", 
        [entranceFee,
          feeAddress,
          raffleDuration]
      );

      await KittenRaffle.waitForDeployment();

      console.log("Адрес контракта:", KittenRaffle.target);

      KittenRaffle.on("RaffleEnter", (newPlayers) => {
        console.log(`RaffleEnter. Players:\n ${newPlayers}`);
      });

      KittenRaffle.on("RaffleRefunded", (player) => {
        console.log(`RaffleRefunded. Refunded player: ${player} `);
      });

      KittenRaffle.on("FeeAddressChanged", (newFeeAddress) => {
        console.log(`FeeAddressChanged. NewFeeAddress: ${newFeeAddress}`);
      });

      KittenRaffle.on("Transfer", (from, to, tokenId) => {
        console.log(`NFT ${tokenId} transfered from ${from} to ${to}`);
      });
  
      return { KittenRaffle, entranceFee };
    }
  
    describe("Tests", async function () {
      it("Re-Entrancy", async function () {
        const {KittenRaffle, entranceFee} = await loadFixture(deployFixture);

        const [ player2, player3 ] = await ethers.getSigners();

        const KittenHack = await ethers.deployContract(
          "KittenHack", 
          [KittenRaffle.target]
        );

        await KittenHack.waitForDeployment();

        console.log("Адрес Hack контракта:", KittenHack.target);

        //Register players and maliscious contract
        await KittenRaffle.enterRaffle([KittenHack.target, player2, player3], {
          value: entranceFee * 3 // number of players
        });

        activePlayerIndex = await KittenRaffle.getActivePlayerIndex(KittenHack.target);

        await KittenHack.attack(activePlayerIndex);

        result = await ethers.provider.getBalance(KittenRaffle.target);
  
        await new Promise(res => setTimeout(res, 4000)); // waits for 4 secs in order to get the events

        expect(result).to.equal(0);
      });      

      it.only("Win kitten", async function () {
        const {KittenRaffle, entranceFee} = await loadFixture(deployFixture);

        const [ feeAddress, player1, player2, player3, player4, p5, p6, p7, p8, p9 ] = await ethers.getSigners();

        console.log("Before raffle balances:")
        console.log(`Player1 balance: ${await getBalance(player1)}`);
        console.log(`Player2 balance: ${await getBalance(player2)}`);
        console.log(`Player3 balance: ${await getBalance(player3)}`);
        console.log(`Player4 balance: ${await getBalance(player4)}`);
        console.log(`FeeAddress balance: ${await getBalance(feeAddress)}`);

        //Register players and maliscious contract
        await KittenRaffle.enterRaffle([player1, player2, player3, player4, p5, p6, p7, p8, p9], {
          value: entranceFee * 9 // number of players
        });

        await KittenRaffle.selectWinner();
  
        await new Promise(res => setTimeout(res, 4000)); // waits for 4 secs in order to get the events

        console.log("After raffle balances:")
        console.log(`Player1 balance: ${await getBalance(player1)}`);
        console.log(`Player2 balance: ${await getBalance(player2)}`);
        console.log(`Player3 balance: ${await getBalance(player3)}`);
        console.log(`Player4 balance: ${await getBalance(player4)}`);
        console.log(`FeeAddress balance: ${await getBalance(feeAddress)}`);

        const tokenUri = await KittenRaffle.tokenURI(0);

        console.log(`Token URI: ${tokenUri}`);

        await new Promise(res => setTimeout(res, 4000)); // waits for 4 secs in order to get the events

        //expect(result).to.equal(0);
      });
      
      it("One player exists", async function () {
        const {KittenRaffle, entranceFee} = await loadFixture(deployFixture);

        const [ feeAddress, player1, player2, player3, player4 ] = await ethers.getSigners();

        console.log("Before raffle balances:")
        console.log(`Player1 balance: ${await getBalance(player1)}`);
        console.log(`Player2 balance: ${await getBalance(player2)}`);
        console.log(`Player3 balance: ${await getBalance(player3)}`);
        console.log(`Player4 balance: ${await getBalance(player4)}`);
        console.log(`FeeAddress balance: ${await getBalance(feeAddress)}`);

        //Register players and maliscious contract
        await KittenRaffle.enterRaffle([player1, player2, player3, player4], {
          value: entranceFee * 4 // number of players
        });

        //One player exits
        activePlayerIndex = await KittenRaffle.getActivePlayerIndex(player2);

        await KittenRaffle.connect(player2).refund(activePlayerIndex);

        await KittenRaffle.selectWinner();

        result = await ethers.provider.getBalance(KittenRaffle.target);
  
        await new Promise(res => setTimeout(res, 4000)); // waits for 4 secs in order to get the events

        console.log("After raffle balances:")
        console.log(`Player1 balance: ${await getBalance(player1)}`);
        console.log(`Player2 balance: ${await getBalance(player2)}`);
        console.log(`Player3 balance: ${await getBalance(player3)}`);
        console.log(`Player4 balance: ${await getBalance(player4)}`);
        console.log(`FeeAddress balance: ${await getBalance(feeAddress)}`);


        //expect(result).to.equal(0);
      });

      it("Change fee address", async function () {
        const {KittenRaffle, entranceFee} = await loadFixture(deployFixture);

        const [ feeAddress, player1, player2, player3, player4 ] = await ethers.getSigners();

        //Register players and maliscious contract
        await KittenRaffle.enterRaffle([player1, player2, player3, player4], {
          value: entranceFee * 4 // number of players
        });

        await KittenRaffle.connect(feeAddress).changeFeeAddress("0x0000000000000000000000000000000000000000");

        await KittenRaffle.selectWinner();

        await KittenRaffle.withdrawFees();
  
        await new Promise(res => setTimeout(res, 4000)); // waits for 4 secs in order to get the events

        const tokenUri = await KittenRaffle.tokenURI(0);
        

        console.log(`Token URI: ${tokenUri}`);

        await new Promise(res => setTimeout(res, 4000)); // waits for 4 secs in order to get the events

        //expect(result).to.equal(0);
      });
    });
  });

  async function getBalance(address) {
    const balance = await ethers.provider.getBalance(address)
    return `${ethers.formatEther(balance)} ETH`
  }