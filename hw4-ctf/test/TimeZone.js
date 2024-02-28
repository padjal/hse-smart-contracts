const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("TimeZone", function () {
  async function deployFixture() {
    const [player, owner] = await hre.ethers.getSigners();

    const HackLibrary = await ethers.deployContract("HackLibrary");
    await HackLibrary.waitForDeployment();
    const HackLibraryAddr = HackLibrary.target;
    console.log("Адрес библиотечного контракта:", HackLibraryAddr);

    const Preservation = await ethers.deployContract("Preservation", [
      HackLibraryAddr,
      owner,
    ]);
    await Preservation.waitForDeployment();
    const PreservationAddr = Preservation.target;
    console.log("Адрес основного контракта:", PreservationAddr);

    return { Preservation, player };
  }

  it("hack", async function () {
    const { Preservation, player } = await loadFixture(deployFixture);

    // напишите свой контракт и тесты, чтобы получить нужное состояние контракта
    await Preservation.connect(player).setTime(123);

    // теперь владелец контракта player, а не owner
    expect(await Preservation.owner()).to.equal(player);
  });
});
