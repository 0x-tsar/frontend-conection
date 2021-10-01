// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public admin;

    constructor() ERC20("LP TOKEN", "LPT") {
        admin = msg.sender;
    }

    function mint(address account, uint256 amount) public {
        require(admin == msg.sender, "must be admin to mint");
        _mint(account, amount);
    }

    function changeAdmin(address newAdmin) public {
        require(admin == msg.sender, "you are not admin");
        admin = newAdmin;
    }
}
