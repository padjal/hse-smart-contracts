const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Telephone", function () {
  async function deployFixture() {
    const [player, owner] = await hre.ethers.getSigners();

    const Telephone = await ethers.deployContract("Telephone", [owner]);
    await Telephone.waitForDeployment();
    const TelephoneAddr = Telephone.target;
    console.log("Адрес контракта:", TelephoneAddr);

    const Caller = await ethers.deployContract("Caller", [owner]);
    await Caller.waitForDeployment();
    const CallerAddr = Caller.target;
    console.log("Адрес контракта Caller:", CallerAddr);

    return { Telephone, Caller, player };
  }

  it("hack", async function () {
    const { Telephone, Caller, player } = await loadFixture(deployFixture);

    // напишите свой контракт и тесты, чтобы получить нужное состояние контракта
    try {
      await Caller.callExternalChangeOwner(Telephone.target, player)
    } catch (error) {
      console.error(error);
      process.exit(1);
    }

    // теперь владелец контракта player, а не owner
    expect(await Telephone.owner()).to.equal(player);
  });
});
