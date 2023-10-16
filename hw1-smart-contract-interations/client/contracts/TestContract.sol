// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract TestContract {
    struct Passport {
        address owner;
        string name;
        uint balance;
    }
    uint storedNumber;
    address owner;
    uint tokens;

    mapping(address => uint) balances;

    constructor() {
        //Owner is saved
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this function.");
        _;
    }

    function set(uint x) public {
        storedNumber = x;
    }

    function get() public view returns (uint) {
        return storedNumber;
    }

    function send(address recipient, uint ammount) public onlyOwner {
        //Take from total supply
        require(ammount > tokens, "Not sufficient funds.");

        tokens -= ammount;

        balances[recipient] += ammount;
    }
}
