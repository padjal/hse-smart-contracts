# CTF

## Telephone
In this task, we need to change the ownership of the contract under test.

```solidity
function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
```

We can easily observer that we need the tx.origin to be different from msg.sender. This points to the fact that we need a chained call with another contract in order to achieve such functionality.

This is why we create a new contract - [Caller.sol](/contracts/Caller.sol), which will act as a gateway.

![Call graph](./res/pics/Telephone.png)