const { getNamedAccounts, deployments } = require('hardhat')
const { LOCAL } = require("../hasbi");
const { expect, assert } = require('chai');
const value = ethers.utils.parseEther("1");


let fish;


describe(
	"Lottery Contract", async () => {
		let LOTTERY;
		
		beforeEach(
			async () => {
				const { deployer } = await getNamedAccounts();
				LOTTERY = await ethers.getContract("lottery");
			}
		)
		it(
			"Should revert should someone enter without start of lottery", async () => {
				const testers = await ethers.getSigners();
				const tester = testers[1];
				expect(LOTTERY.connect(tester).enter({value: value})).to.be.reverted;
			}
		)
		it(
			"Should update players array", async () => {
				const { deployer } = await getNamedAccounts();
				const testers = await ethers.getSigners();
				const tester = testers[1];
				await LOTTERY.startLottery({from: deployer})
				await LOTTERY.connect(tester).enter({value: value})
				const expected1 = await LOTTERY.showIndex(0)
				const expected2 = tester.address.toString();
				assert.equal(expected2, expected1);
			}
		)
		it( 
			"Should revert if enough time hasn't passed after start of lottery", async () => {
				const { deployer } = await getNamedAccounts();
				const testers = await ethers.getSigners();
				const tester = testers[1];
				//await LOTTERY.startLottery({from: deployer})
				expect(LOTTERY.end({from: deployer})).to.be.reverted;
			}
		)

		it(
			"Should revert should someone else start or end the lottery", async () => {
				const { deployer } = await getNamedAccounts();
				const testers = await ethers.getSigners();
				const tester = testers[1];
				expect(LOTTERY.connect(tester).startLottery()).to.be.reverted;
				expect(LOTTERY.connect(tester).end()).to.be.reverted;
			}
		)

		it.only(
			"Should pay winner after ending", async () => {
				const { deployer } = await getNamedAccounts();
				const testers = await ethers.getSigners();
				const tester = testers[1];
				await LOTTERY.startLottery({from: deployer})
				await LOTTERY.connect(tester).enter({value: value});
				await LOTTERY.end({from: deployer});
				const response = await LOTTERY.revealwinner();
				const expected = tester.address.toString();
				assert.equal(response.toString(), expected);
			}
		)


	}
)