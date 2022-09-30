const { getNamedAccounts, deployments, ethers } = require('hardhat')
const value = ethers.utils.parseEther("0.25");
const evalue = ethers.utils.parseEther("1");

async function main() {

	console.log("Updating Contracts...");
	// await deployments.fixture();
	const LOTTERY = await ethers.getContract("lottery");

	const { deployer } = await getNamedAccounts();
	const testero1 = await ethers.getSigners();
	const tester1 = testero1.address;
	const testero2 = await ethers.getSigners();
	const tester2 = testero2.address;
	const testero3 = await ethers.getSigners();
	const tester3 = testero3.address;

	 const LINK = await ethers.getContract("LinkToken");
	 tx = await LINK.transfer(LOTTERY.address, value, {from: deployer});
	 tx.wait(2)
    console.log(`${LOTTERY.address} has been funded with ${value} LINK`);

    // console.log("starting lottery...")	
    // tx2 = await LOTTERY.startLottery({from: deployer});
    // tx2.wait(100000000000);
    // console.log("Lottery has started");    

    tx3 = await LOTTERY.enter({from: tester1, value: evalue});
    tx3.wait(100000000000)
    console.log(`${tester1} has entered the lottery`);

    tx5 = await LOTTERY.enter({from: tester2, value: evalue});
    tx5.wait(100000000000)
    console.log(`${tester2} has entered the lottery`);

    tx6 = await LOTTERY.enter({from: tester3, value: evalue});
    tx6.wait(100000000000)
    console.log(`${tester3} has entered the lottery`);

 	console.log("ending lottery...");
   tx7 = await LOTTERY.end({from: deployer});
   tx7.wait(1);
   console.log("lottery ended");
   const winner = await LOTTERY.revealwinner()
   console.log(winner);  
    
}

main()
.then(() => process.exit(0))
.catch((error) => {
	console.error(error)
	process.exit(1)
})

