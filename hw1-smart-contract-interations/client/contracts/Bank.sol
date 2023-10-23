// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Bank {
    struct Client {
        string name;
        uint balance;
        uint age;
        bool exists;
    }
    
    address owner;

    mapping(address => Client) clients;

    event ClientAdded (address indexed clientAddress, Client client);

    event ClientRemoved (address indexed clientAddress, Client client);

    constructor() {
        //Owner is saved
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this function.");
        _;
    }

    modifier clientNotRegistered() {
        require(clients[msg.sender].exists, "Client with this address is already registerd.");
        _;
    }

    function addClient(string calldata name, uint age, uint balance) public clientNotRegistered{
        clients[msg.sender] = Client(name, age, balance, true);

        emit ClientAdded(msg.sender, clients[msg.sender]);
    }

    function deleteClient(address clientAddress) public onlyOwner {
        clients[clientAddress].exists = false;

        emit ClientRemoved(clientAddress, clients[clientAddress]);
    }
}
