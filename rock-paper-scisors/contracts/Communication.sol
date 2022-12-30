// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// A smart contract for registering users in the Rock-Paper-Scissors game
contract Communication {
    constructor() {}

    function registerUser(address contractAddress) public payable {
        (bool sent, bytes memory data) = contractAddress.call{value: msg.value}(
            ""
        );

        require(sent, "Failed to send Ether");
    }
}
