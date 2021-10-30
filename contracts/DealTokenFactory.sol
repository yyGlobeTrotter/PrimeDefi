// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "./DealToken.sol";

/** 
 * @title DealTokenFactory
 * @dev Create new deal tokens from here and keep track of all deal tokens issued
 */
contract DealTokenFactory {
    
    using SafeMath for uint256;
    
    uint256 public tokenCount;
    
    mapping(address => address[]) public created;
    
    function createDealToken(
        address _escrowAccount,
        uint256 _totalSupply,
        uint256 _faceValue,
        uint256 _tenor,
        uint256 _interestRate,
        string memory _name, 
        string memory _symbol
    ) public returns (address) {
        
        DealToken newToken = (new DealToken(_escrowAccount, _totalSupply, _faceValue, _tenor, _interestRate, _name, _symbol));
        created[msg.sender].push(address(newToken));
        tokenCount++;

        return address(newToken);
    }
        
}
