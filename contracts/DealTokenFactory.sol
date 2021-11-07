//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "./DealToken.sol";

/**
 * @title DealTokenFactory
 * @dev Create new deal tokens from here and keep track of all tokens issued
 */
contract DealTokenFactory {

    using SafeMath for uint256;

    uint256 public tokenCount;

    mapping(address => address[]) public tokenCreated;

    event LogCreateToken(address indexed _tokenAddress, address indexed _issuer, string _name, string _symbol, uint256 _totalSupply);

    function createToken(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) public returns (address) {

        DealToken dealToken = new DealToken(_name, _symbol, _totalSupply);
        emit LogCreateToken(address(dealToken), msg.sender, _name, _symbol, _totalSupply);

        tokenCreated[msg.sender].push(address(dealToken));
        tokenCount++;

        return address(dealToken);
    }

}
