//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

import "./DealToken.sol";

contract DealTokenManager {
    //mapping( address => DealToken ) public tokens;
    mapping( address => address ) public tokenOwners;
    mapping( string => bool ) public isTokenNameTaken;

    function setTokenOwner(address _token, address _owner) public {
        tokenOwners[_token] = _owner;
    }

    function transfer(address _token, address _to, uint256 _amount) public {
        require(msg.sender == tokenOwners[_token], "Not authorized");
        require(DealToken(_token).allowance(msg.sender, address(this)) >= _amount, "Not enough allowance for this sender");

        DealToken(_token).transferFrom(msg.sender, _to, _amount);
    }
}
