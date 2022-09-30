const { ethers, hre } = require('hardhat');
const value = ethers.utils.parseEther("0.25");
const valuee = ethers.utils.parseEther("0.2");


module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const keyhash = "0x0476f9a745b61ea5c0ab224d3a6e4c99f0b02fce4da01143a4f70aa80ae76e8a";
	const fee = "250000000000000000";
	const chainId = network.config.chainId;
	let LINK;
	let VRF;
	let Largs;
	let LOTTERY;

	if(chainId == 1337 || chainId == 31337){
		console.log("Deploying Mocks");
		LINK = await deploy("LinkToken", {
			from: deployer,
			contract: "LinkToken",
			log: true
		})

		VRF = await deploy("VRFCoordinatorMock", {
			from: deployer,
			contract: "VRFCoordinatorMock",
			args: [LINK.address],
			log: true
		})	

	    Largs = [keyhash, fee, LINK.address, VRF.address]	

	}else{
		Largs = [keyhash, fee, network.config.link, network.config.vrf]
	}

	console.log("Deploying Lottery...")
	LOTTERY = await deploy("lottery", {
		from: deployer,
		contract: "lottery",
		args: Largs,
		log: true
	})	

	console.log("funding with link...")
	const LINKC = await ethers.getContract("LinkToken");
	const tx = await LINKC.transfer(LOTTERY.address, value, {from: deployer});
	tx.wait(1);
	console.log("Funded with Link!");

	console.log("Contract deployed successfully");
}

module.exports.tags = ["all"]