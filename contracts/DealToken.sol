// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

/** 
 * @title DealToken
 * @dev Represents one particular token created for one issuance
 */
contract DealToken {
    
    using SafeMath for uint256;
    
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;
    
    address public issuer;
    
    address public escrowAccount;
    
    uint256 public totalSupply;
    
    uint256 public faceValue;
    
    uint256 public tenor;
    
    uint256 public interestRate;
    
    string public name;
    
    string public symbol;
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    //event MinterChanged(address minter, address newMinter);

    // PAUSABLE EVENTS
    event Pause();
    event Unpause();
    
    // ASSET PROTECTION EVENTS
    event AddressFrozen(address indexed addr);
    event AddressUnfrozen(address indexed addr);
    event FrozenAddressWiped(address indexed addr);
    
    /**
     * @notice Construct a new deal token
     * @param _escrowAccount Address of the escrow account for this new issuance
     * @param _totalSupply Total suppy for the newly minted token
     * @param _faceValue Face value (i.e. US$100) of the token
     * @param _tenor Term of the new issuance (i.e. 2 years)
     * @param _interestRate Interest Rate of the new issuance
     * @param _name The name of the new issuance
     * @param _symbol The symbol of the new issuance
     */
   
    /*constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }*/
    constructor (
        address _escrowAccount,
        uint256 _totalSupply,
        uint256 _faceValue,
        uint256 _tenor,
        uint256 _interestRate,
        string memory _name, 
        string memory _symbol
    ) {
        issuer = msg.sender;
        escrowAccount = _escrowAccount;
        //totalSupply = _totalSupply;
        faceValue = _faceValue;
        tenor = _tenor;
        interestRate = _interestRate;
        name = _name;
        symbol = _symbol;
        
        _mint(escrowAccount, _totalSupply);
    }

    /**
     * @notice Get the number of tokens held by the `_account`
     * @param _account The address of the account to get the balance of
     * @return The number of tokens held
     */
    function balanceOf(address _account) public view returns (uint256) {
        return balances[_account];
    } 
    
    /**
     * @notice Transfer `amount` tokens from `msg.sender` to `_to' account
     * @param _to The address of the destination account
     * @param _amount The number of tokens to transfer
     * @return Whether or not the transfer succeeded
     */

    function transfer(address _to, uint256 _amount) public returns (bool) {
        //uint96 amount = safe96(_tokenAmount, "Token::transfer: amount exceeds 96 bits");
        _transfer(msg.sender, _to, _amount);
        return true;
    }
    
    
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }
    
    
    function approve(address _spender, uint256 _amount) public returns (bool) {
        _approve(msg.sender, _spender, _amount);
        return true;
    }
    
    
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool) {
            _transfer(_from, _to, _amount);
            
            uint256 currentAllowance = allowances[_from][msg.sender];
            require(currentAllowance >= _amount, "DealToken:  transfer amount exceeds allowance");
            _approve(_from, msg.sender, currentAllowance - _amount);
            
            return true;
    }
    
    
    function _transfer(address _from, address _to, uint256 _amount) internal {
        require(_from != address(0), "DealToken: transfer from the zero address");
        require(_to != address(0), "DealToken: transfer to the zero address");
        
        uint256 senderBalance = balances[_from];
        require(senderBalance >= _amount, "DealToken: transfer amount exceeds balance");
        balances[_from] = senderBalance - _amount;
        balances[_to] += _amount;

        emit Transfer(_from, _to, _amount);
    }
    
    
    function _mint(address _account, uint256 _amount) internal {
        require(_account != address(0), "DealToken: mint to the zero address");
        
        totalSupply += _amount;
        balances[_account] += _amount;
        emit Transfer(address(0), _account, _amount);
    }
    
    
    function _burn(address _account, uint256 _amount) internal {
        require(_account != address(0), "DealToken: burn from the zero address");

        uint256 accountBalance = balances[_account];
        require(accountBalance >= _amount, "DealToken: burn amount exceeds balance");
        balances[_account] = accountBalance - _amount;
        totalSupply -= _amount;

        emit Transfer(_account, address(0), _amount);
    }
    
    
    function _approve(address _owner, address _spender, uint256 _amount) internal {
        require(_owner != address(0), "DealToken: approve from the zero address");
        require(_spender != address(0), "DealToken: approve to the zero address");

        allowances[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }

}
