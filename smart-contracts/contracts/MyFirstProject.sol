// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyFirstContract {
    uint public number = 10;
    string public name = "First Contract";

    function setNumber(uint _newNumber) public {
        number = _newNumber;
    }

    function setName(string memory _newName) public {
        name = _newName;
    }
}
