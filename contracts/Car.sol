// SPDX-License-Identifier: MIT

pragma solidity ^0.8.5;

contract Car {
    string public brand;

    function getBrand() public view returns (string memory) {
        return brand;
    }

    function setBrand(string memory newBrand) public {
        brand = newBrand;
    }
}
