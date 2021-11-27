// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

//import "@OpenZeppelin/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

/**
 * @title DealToken
 * @author 0xYue
 * @dev Represents one particular token created for one issuance
 */
contract DealToken is ERC20 {
    /**
     * @notice Construct a new deal token
     * @param _owner The address of the initial holder of the newly minted token
     * @param _theName The name of the new issuance
     * @param _theSymbol The symbol of the new issuance
     * @param _totalSupply Final number of tokens to be minted
     */
    constructor(address _owner, string memory _theName, string memory _theSymbol, uint256 _totalSupply) ERC20(_theName, _theSymbol) {
        _mint(_owner, _totalSupply);
    }
}
