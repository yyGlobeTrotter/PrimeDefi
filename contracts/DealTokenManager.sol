// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./DealToken.sol";

contract DealTokenManager {
    mapping( address => address ) public tokenOwners;
    mapping( string => bool ) public isTokenNameTaken;

    function setTokenOwner(address _token, address _owner) public {
        tokenOwners[_token] = _owner;
    }

    function getTokenOwner(address _token) public view returns(address) {
        return tokenOwners[_token];
    }

    function transfer(address _token, address _to, uint256 _amount) public {
        require(msg.sender == tokenOwners[_token], "Not authorized");
        require(DealToken(_token).allowance(msg.sender, address(this)) >= _amount, "Not enough allowance for this sender");

        DealToken(_token).transferFrom(msg.sender, _to, _amount);
    }
}
