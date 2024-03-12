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
    });
  });