	const { deployments, getNamedAccounts, ethers } = require('hardhat');
	let LOTTERY;


	async function setdeployer() {
		const { deployer } = await getNamedAccounts();
		return deployer;
	}

	async function settester() {
		const { tester } = await getNamedAccounts();
		return tester;
	}

	async function main(address) {	
		var rest = await setdeployer();
		console.log(rest)
		LOTTERY = await ethers.getContract("lottery");	
        const res = await LOTTERY.assertState();
        if (res == true) {
        	console.log("lottery is already open");
        } else {
        	console.log("Starting Lottery...")
			const tx = await LOTTERY.startLottery({from: rest});
			tx.wait(1);
			console.log("Lottery has started!!");	
        }
		
	} 

	main(setdeployer())
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})