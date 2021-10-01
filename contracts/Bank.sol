// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Token.sol";

contract Bank {
    address public admin;
    Token private token;
    mapping(address => uint256) public etherAmount;
    mapping(address => uint256) public depositStart;

    constructor(Token _token) {
        token = _token;
    }

    function deposit() external payable {
        require(etherAmount[msg.sender] == 0, "withdraw your funds first");
        require(msg.value >= 1e16, "Error, deposit must be >= 0.01 ETH");

        etherAmount[msg.sender] = etherAmount[msg.sender] + msg.value;
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
    }

    function withdraw() external {
        require(etherAmount[msg.sender] > 0, "must have amount to retrieve");

        payable(msg.sender).transfer(etherAmount[msg.sender]);
        uint256 interest = block.timestamp - depositStart[msg.sender];
        token.mint(msg.sender, interest);

        etherAmount[msg.sender] = 0;
        depositStart[msg.sender] = 0;
    }
}
