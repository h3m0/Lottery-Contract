    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;
    import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
    import "hardhat/console.sol";
    /** 
    GOERLI
    priceFeed: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    Vrf: 0x2bce784e69d2Ff36c71edcB9F88358dB0DfB55b4
    Link token: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
    keyhash: 0x0476f9a745b61ea5c0ab224d3a6e4c99f0b02fce4da01143a4f70aa80ae76e8a
    fee: 250000000000000000
    **/

    /** 
    RINKEBY
    priceFeed: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
    Vrf: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
    Link token: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
    keyhash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
    fee: 10000000000000000
    330000000000000000
    7200000000000000
    **/

    contract lottery is VRFConsumerBase {
       
        address payable public recentwinner;
        uint internal date;
        bytes32 public keyhash;
        address public link;
        uint public fee;
        address public VRF;    
        address[] public players;
        uint public efee;
        enum State { OPEN, CLOSED, CALCULATING_WINNER}
        State currentState;
        address payable owner;
        uint public randomResult;
        bytes32 public requestId;
        uint internal count;

        constructor(        
             bytes32 _keyhash,
             uint _fee,
             address _link,
             address _vrf
        ) VRFConsumerBase(
            _vrf,
            _link
        ){      
            efee = 1 ether;
            owner = payable(msg.sender);
            keyhash = _keyhash;=
            fee = _fee;
            currentState = State.CLOSED;
        } 
      
        function getRandomNumber() public payable{
            requestRandomness(keyhash, fee);
            date = block.timestamp;       
        }

        function fulfillRandomness(bytes32 _requestId, uint _randomness) internal override {
             randomResult = _randomness;
            _requestId = requestId;
        }

        function enter() public payable {
            require(currentState == State.OPEN, "Lottery isn't open yet");
            require(msg.value >= efee, "Sorry, Not enough ETH");
            players.push(msg.sender);
        }    

        function startLottery() public {
            require(msg.sender == owner, "Not Owner");
            require(currentState == State.CLOSED, "Lottery is already open");
            currentState = State.OPEN;
            getRandomNumber();
        }   

        function end() public {
            require(msg.sender == owner, "Not Owner");
            require(currentState == State.OPEN, "Please restart the lottery);
            require(block.timestamp > date + 200, "Try again later");
            currentState = State.CALCULATING_WINNER; 
            uint indexOf = randomResult % players.length;
            recentwinner = payable(players[indexOf]);
            recentwinner.transfer(address(this).balance);
        } 

        /** FOR TESTING */
        function revealwinner() public view returns(address payable) {
            return recentwinner;
        }

        function assertState () public view returns(bool){
            if(currentState == State.OPEN){
                return true;
            }else {
                return false;
            }
        }

        function showIndex(uint _index) public view returns(address){
            return players[_index];
        }  
    }