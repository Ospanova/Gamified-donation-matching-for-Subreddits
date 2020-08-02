const { ethers } = require("@nomiclabs/buidler");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Dapp", function () {
  let mainContract;

  describe("MainContract", function () {
    it("Should deploy MainContract", async function () {
      const MainContract = await ethers.getContractFactory("MainContract");
      mainContract = await MainContract.deploy();
    });

    describe("addProject()", function () {
      it("Should be able to add a new project", async function () {
        const newProjectTitle = "New project";
        const newProjectDescription = "This is a new project";

        await mainContract.addProject(newProjectTitle, newProjectDescription);

        const project = await mainContract.getProject(0);
        expect(project.title).to.equal(newProjectTitle);
        expect(project.description).to.equal(newProjectDescription);
      });
    });
  });
});
