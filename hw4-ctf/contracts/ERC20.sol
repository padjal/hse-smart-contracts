// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract ERC20 {
    address private _creator;

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 public decimals = 0;
    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    bool private _stop;

    modifier onlyCreator() {
        require(
            msg.sender == _creator,
            "Only the owner can call this function"
        );
        _;
    }

    modifier checkStop() {
        require(!_stop, "The token doesn't work");
        _;
    }

    function changeCreator() external checkStop {
        _creator = msg.sender;
    }

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _stop = false;
        _creator = msg.sender;
    }

    function stopToken() external checkStop {
        _stop = true;
    }

    function startToken() external onlyCreator checkStop {
        _stop = false;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function stop() public view returns (bool) {
        return _stop;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function creator() public view returns (address) {
        return _creator;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(
        address to,
        uint256 amount
    ) public checkStop returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(
        address spender,
        uint256 amount
    ) public checkStop returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public checkStop returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function increaseAllowance(
        address spender,
        uint256 addedValue
    ) public checkStop returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue
    ) public checkStop returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = allowance(owner, spender);
        require(
            currentAllowance >= subtractedValue,
            "ERC20: decreased allowance below zero"
        );
        unchecked {
            _approve(owner, spender, currentAllowance + subtractedValue);
        }

        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal  {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = _balances[from];
        require(
            fromBalance >= amount,
            "ERC20: transfer amount exceeds balance"
        );

        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }
    }

    function mint(address account, uint256 amount) external checkStop onlyCreator {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply += amount;
        unchecked {
            _balances[account] += amount;
        }
    }

    function burn(address account, uint256 amount) external checkStop {
        require(account != address(0), "ERC20: burn from the zero address");

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            _totalSupply -= amount;
        }
    }

    function _approve(address owner, address spender, uint256 amount) public {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
    }

    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(
                currentAllowance >= amount,
                "ERC20: insufficient allowance"
            );
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }
}
