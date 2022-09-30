	const { deployments, getNamedAccounts, ethers } = require('hardhat');
	const fee = ethers.utils.parseEther("1");
	const sfee = ethers.utils.parseEther("0.25");
	let LOTTERY;

	async function setdeployer() {
		const { deployer } = await getNamedAccounts();
		return deployer;
	}

	async function settester() {
		const { tester } = await getNamedAccounts();
		return tester;
	}

	async function main(address, value) {
		LOTTERY = await ethers.getContract("lottery");
		console.log(value)
		console.log(address);
		const res = await LOTTERY.assertState();
		if (!res) {
		 	console.log("Lottery hasn't started yet")		 	
		} if (value < fee) {
			console.log("Not Enough ETH!")
		}else {
			tx = await LOTTERY.enter({value: value, from: address, gasLimit: fee});
			tx.wait(1);
			const call =  await LOTTERY.showIndex(1);
			console.log(call);
		}		
	}

	main(setdeployer(), sfee)
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})