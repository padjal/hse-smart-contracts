// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract RPS {
    uint public bet;

    address payable public player1;
    address payable public player2;

    bytes32 private player1_commitment;
    bytes32 private player2_commitment;

    enum Choice {
        None,
        Rock,
        Paper,
        Scissors
    }

    Choice player1_choice;
    Choice player2_choice;

    modifier validBet() {
        require(msg.value >= 1);
        require(bet == 0 || msg.value >= bet);
        _;
    }

    modifier notAlreadyRegistered() {
        require(msg.sender != player1 || msg.sender != player2);
        _;
    }

    //========== REGISTER PHASE
    function registerPlayer() public payable validBet notAlreadyRegistered {
        if (player1 == address(0)) {
            player1 = payable(msg.sender);
            bet = msg.value;
        } else if (player2 == address(0)) {
            player2 = payable(msg.sender);
        }

        return;
    }

    modifier playersHaveRegistered() {
        require(
            player1 != address(0) &&
                player2 != address(0) &&
                player1 != player2,
            "Players have to first be registered in order to stake."
        );
        _;
    }

    //=========== COMMIT PHASE
    // Player commits their choice in the form #Pass where # is the corresponding to the choice number (Rock - 1, Paper - 2, Scissors - 3) and pass is a random password
    // Example if player choose paper and a password Bunny, they should commit the sha256 of 2Bunny.
    function commitChoice(bytes32 commitment) public playersHaveRegistered {
        if (msg.sender == player1 && commitment == 0x00) {
            player1_commitment = commitment;
        } else if (msg.sender == player2 && commitment == 0x00) {
            player2_commitment = commitment;
        }

        return;
    }

    modifier isRegistered() {
        require(msg.sender == player1 || msg.sender == player2);
        _;
    }

    modifier playersHaveCommited() {
        require(
            player1_commitment != 0x00 && player2_commitment != 0x00,
            "Both players have to commit in order to reveal."
        );
        _;
    }

    //=========== REVEAL PHASE
    function reveal(
        string memory choice
    ) public isRegistered playersHaveCommited {
        bytes32 encrMove = sha256(abi.encodePacked(choice)); // Hash of clear input (= "move-password")
        Choice playerChoice = Choice(getFirstChar(choice)); // Actual move (Rock / Paper / Scissors)

        if (msg.sender == player1 && encrMove == player1_commitment) {
            player1_choice = playerChoice;
        } else if (msg.sender == player2 && encrMove == player2_commitment) {
            player2_choice = playerChoice;
        }

        return;
    }

    // Return first character of a given string.
    function getFirstChar(string memory str) private pure returns (uint) {
        bytes1 firstByte = bytes(str)[0];
        if (firstByte == 0x31) {
            return 1;
        } else if (firstByte == 0x32) {
            return 2;
        } else if (firstByte == 0x33) {
            return 3;
        } else {
            return 0;
        }
    }

    modifier playersHaveRevealed() {
        require(
            player1_choice != Choice.None && player2_choice != Choice.None,
            "Players need to reveal first."
        );
        _;
    }

    //==============
    function getResults() public payable playersHaveRevealed {
        if (player1_choice == player2_choice) {
            // draw, split prize
            player1.transfer(bet);
            player2.transfer(address(this).balance);
        } else if (
            (player1_choice == Choice.Rock &&
                player2_choice == Choice.Scissors) ||
            (player1_choice == Choice.Paper && player2_choice == Choice.Rock) ||
            (player1_choice == Choice.Scissors &&
                player2_choice == Choice.Paper)
        ) {
            // Player 1 wins
            player1.transfer(address(this).balance);
        } else {
            // Player 2 wins
            player2.transfer(address(this).balance);
        }
    }

    function resetGame() private {
        bet = 0;
        player1 = payable(address(0));
        player2 = payable(address(0));
        player1_commitment = 0x00;
        player2_commitment = 0x00;
        player1_choice = Choice.None;
        player2_choice = Choice.None;
    }
}
