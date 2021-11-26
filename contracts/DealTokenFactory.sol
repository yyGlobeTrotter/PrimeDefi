// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./DealToken.sol";

/**
 * @title DealTokenFactory
 * @author 0xYue
 * @dev Create new deal tokens from here and keep track of all tokens issued
 */
contract DealTokenFactory {
    uint256 public tokenCount;
    address public tokenAddr;

    mapping(address => address[]) public tokenCreated;

    function createToken(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) public returns (address) {

        DealToken dealToken = new DealToken(
            msg.sender,
            _name,
            _symbol,
            _totalSupply
        );

        tokenAddr = address(dealToken);
        tokenCreated[msg.sender].push() = tokenAddr;
        tokenCount++;

        return tokenAddr;
    }
}
