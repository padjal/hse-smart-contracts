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
    uint id;

    mapping(uint => Client) clients;

    event ClientAdded (uint indexed clientId, Client client);

    event ClientRemoved (uint indexed clientId, Client client);

    constructor() {
        //Owner is saved
        owner = msg.sender;
        id = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this function.");
        _;
    }

    modifier clientExists(uint clientId){
        require(clients[id].exists, "Client with this id does not exist.");
        _;
    }

    /**
     *  Add a new client. Can be called by everyone.
     * @param name The name of the new client.
     * @param age The age of the new client.
     * @param balance The account balance of the new client.
     */
    function addClient(string calldata name, uint age, uint balance) public{
        clients[id] = Client(name, age, balance, true);

        emit ClientAdded(id, clients[id]);

        id++;
    }

    /**
     * Delete a client by id.
     * @param clientId The id of the client to be deleted.
     */
    function deleteClient(uint clientId) clientExists(clientId) public {
        clients[id].exists = false;

        emit ClientRemoved(clientId, clients[clientId]);
    }

    /**
     * Gets the id for the next client.
     */
    function getCurrentId() public view returns (uint){
        return id;
    }

    /**
     * Gets the client instance by id.
     * @param clientId The client id of the given client.
     */
    function getClient(uint clientId) clientExists(clientId) public view returns (Client memory) {
        return clients[clientId];
    }
}
