// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITelephone{
    function changeOwner(address _owner) external;
}

contract Caller{
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function callExternalChangeOwner(address _contractAddress, address _newOwner) public {
        ITelephone telephone = ITelephone(_contractAddress);

        telephone.changeOwner(_newOwner);
    }
}