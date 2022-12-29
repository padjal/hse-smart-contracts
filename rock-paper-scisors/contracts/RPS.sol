// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract rps {
    address payable public player1;
    address payable public player2;

    enum Choice {
        Rock,
        Paper,
        Scissors
    }

    constructor() {}

    modifier playersHaveRegistered() {
        require(
            player1 != address(0) &&
                player2 != address(0) &&
                player1 != player2,
            "Players have to first be registered in order to stake."
        );
        _;
    }

    function registerPlayer() public {
        if (player1 == address(0)) {
            player1 = payable(msg.sender);
        } else if (player2 == address(0)) {
            player2 = payable(msg.sender);
        }

        return;
    }
}
