//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/Math.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

import "./DealToken.sol";
import "./DealTokenFactory.sol";


/**
 * @title Deal
 * @author 0xYue
 * @dev Implements the entire deal issuance book building process which includes creation of new deals and minting & allocation of the new deal token
 */
contract Deal is Ownable {
    /// Libraries
    using SafeMath for uint256;
    using SafeMath for uint;

    /// Events - Publicize actions to external listeners

    event LogCreateDealIssuance(address indexed _issuer, string indexed _ISIN, string _dealName, uint256 _initSize, uint256 _minSize, uint256 _faceValue, uint _offerStartTime, uint _offerCloseTime, uint256 _tenor, uint256 _interestRate, uint256 _upfrontFee);
    event LogEditDealIssuance(address indexed _issuer, string indexed _ISIN, string _newDealName, uint256 _newInitSize, uint256 _newMinSize, uint _newOfferCloseTime, uint256 _newTenor, uint256 _newInterestRate, uint256 _newUpfrontFee);

    event LogEditTokenDetails(address indexed _issuer, string indexed _ISIN, string _newName);
    event LogCreatToken(address indexed _issuer, string indexed _ISIN, string name, string symbol, uint256 totalSupply);

    event LogCancelDeal(address indexed _issuer, string indexed _ISIN);

    //event LogAllocateDeal();
    //...more...

    /// This represents different state during issuing process; Certain actions are only allowed within certain state
    enum State {
        INACTIVE,       // before deal issuance creation, default state
        OFFERLIVE,      // offer period has started but not closed
        OFFERCLOSED,    // offer period has closed out but investment/tokens not allocated yet
        ISSUED,         // investment/tokens have been allocated and official issuance started
        CANCELLED,      // deal issuance has been cancelled due to insuffient fund raised, or other reasons
        REDEEMED        // the end of deal lifecycle - maturity or early redemption; principle investment and any last coupons are paid out, all o/s deal tokens are destroyed
    }

    /// This represents an unique investor
    struct Investor {
        //address payable addr;
        address addr;

        string[] dealsBidded;  // a ventor of the deal issuance ISINs the investor has participated in bidding

        uint256 totalBalance;
        uint256 totalLockedInBid;
        uint256 availBalance;       // totalBalance minus totalLockedInBid


        mapping(string => bool) isOfferClosed;      // mapping deal ISIN to a boolean; "true" means that the issuance offer period is closed
        mapping(string => bool) isBidSuccessful;    // mapping deal ISIN to a boolean; "true" means that investor'd bid to an issuance is successful
        mapping(string => uint256) lockedInBid;     // mapping deal ISIN to investment amount the investor has allocated to that deal
    }

    /// This represents an unique issuer
    struct Issuer {
        //address payable addr;
        address addr;

        string[] dealsIssued;    // A vector of issuance ISINs

        //uint256 totalIssuedAmount;
        //uint256 totalEscrowFundLockedIn;
        //uint256 totalAvailBalance;

        mapping(string => uint256) finalSize;   // mapping deal ISIN to final size raised for that issuance, including escrow allocation
        mapping(string => uint256) escrowFundLockedIn;   //mapping deal ISIN to allocated escrow fund lock-in in Issuer wallet for that particular issuance
        mapping(string => uint256) availBalance;    //mapping deal ISIN to available balance of the Issuer wallet (finalSize - escrow at the beginning; can be zero in between payment dates; must have enough fund 5bd before next payment date)
    }

    /// This represents an unique token
    struct Token {
        address dealtoken;
        address issuer;
        string name;
        string symbol;      // use issuance ISIN as token symbol
        uint256 totalSupply;    // finalSize divided by facevalue
    }

    /// This represents an unique issuance
    struct DealIssuance {
        string ISIN;    // the 12-digit unique identifier of an issuance

        string dealName;
        uint256 initSize;   // front-end needs to pass this value in units of our stablecoin of choice
        uint256 minSize;    // minimum launch size, same unit of measurement as above
        uint256 faceValue;  // it represents value of 1 deal token (the min investment unit); same unit of measurement as above
        uint offerStartTime;    // use deal creation time block timestamp for now
        uint offerCloseTime;    // either a fixed date/time, or a reletive one (i.e. 5 days after offerStartTime). For now use fixed
        uint issueDate;         // use offerCloseTime as issueDate for now, but keep the field open for issuer flexibility
        uint256 tenor;          // number of seconds, minutes, hours, days, or weeks (no more years since v0.5.0 due to leap seconds concerns). For now use number of DAYS
        uint maturityDate;      // issueDate + tenor
        uint256 interestRate;   // either floating or fixed. Assuming fixed rate for now (i.e. 2,125 means 2.125%)
        uint[] interestPaymentDates;    // for now start with zero-coupon bond (meaning no interim coupons but bond selling at a discount to face value); keep the field for future dev
        uint256 upfrontFee;     // this is the fee Issuer wants to charge for the issuance (i.e. 2,000 means 2% fee of total issue size)

        uint256 finalSize;      // this is the final issuance size, determined by min(initSize, total investor bids), and only if total investor bids >= minSize

        Token token;
        State state;
        bool isOfferLive;

        address issuer;

        address[] investors;//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/Math.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

import "./DealToken.sol";
import "./DealTokenFactory.sol";


/**
 * @title Deal
 * @author 0xYue
 * @dev Implements the entire deal issuance book building process which includes creation of new deals and minting & allocation of the new deal token
 */
contract Deal is Ownable {
    /// Libraries
    using SafeMath for uint256;
    using SafeMath for uint;

    /// Events - Publicize actions to external listeners

    event LogCreateDealIssuance(address indexed _issuer, string indexed _ISIN, string _dealName, uint256 _initSize, uint256 _minSize, uint256 _faceValue, uint _offerStartTime, uint _offerCloseTime, uint256 _tenor, uint256 _interestRate, uint256 _upfrontFee);
    event LogEditDealIssuance(address indexed _issuer, string indexed _ISIN, string _newDealName, uint256 _newInitSize, uint256 _newMinSize, uint _newOfferCloseTime, uint256 _newTenor, uint256 _newInterestRate, uint256 _newUpfrontFee);

    event LogEditTokenDetails(address indexed _issuer, string indexed _ISIN, string _newName);
    event LogCreatToken(address indexed _issuer, string indexed _ISIN, string name, string symbol, uint256 totalSupply);

    event LogCancelDeal(address indexed _issuer, string indexed _ISIN);

    //event LogIssuanceFundTransfer();
    //...more...

    /// This represents different state during issuing process; Certain actions are only allowed within certain state
    enum State {
        INACTIVE,       // before deal issuance creation, default state
        OFFERLIVE,      // offer period has started but not closed
        OFFERCLOSED,    // offer period has closed out but investment/tokens not allocated yet
        ISSUED,         // investment/tokens have been allocated and official issuance started
        CANCELLED,      // deal issuance has been cancelled due to insuffient fund raised, or other reasons
        REDEEMED        // the end of deal lifecycle - maturity or early redemption; principle investment and any last coupons are paid out, all o/s deal tokens are destroyed
    }

    /// This represents an unique investor
    struct Investor {
        //address payable addr;
        address addr;

        string[] dealsBidded;  // a ventor of the deal issuance ISINs the investor has participated in bidding

        uint256 totalBalance;
        uint256 totalLockedInBid;
        uint256 availBalance;       // totalBalance minus totalLockedInBid


        mapping(string => bool) isOfferClosed;      // mapping deal ISIN to a boolean; "true" means that the issuance offer period is closed
        mapping(string => bool) isBidSuccessful;    // mapping deal ISIN to a boolean; "true" means that investor'd bid to an issuance is successful
        mapping(string => uint256) lockedInBid;     // mapping deal ISIN to investment amount the investor has allocated to that deal
    }

    /// This represents an unique issuer
    struct Issuer {
        //address payable addr;
        address addr;

        string[] dealsIssued;    // A vector of issuance ISINs

        //uint256 totalIssuedAmount;
        //uint256 totalEscrowFundLockedIn;
        //uint256 totalAvailBalance;

        mapping(string => uint256) finalSize;   // mapping deal ISIN to final size raised for that issuance, including escrow allocation
        mapping(string => uint256) escrowFundLockedIn;   //mapping deal ISIN to allocated escrow fund lock-in in Issuer wallet for that particular issuance
        mapping(string => uint256) availBalance;    //mapping deal ISIN to available balance of the Issuer wallet (finalSize - escrow at the beginning; can be zero in between payment dates; must have enough fund 5bd before next payment date)
    }

    /// This represents an unique token
    struct Token {
        address dealtoken;
        address issuer;
        string name;
        string symbol;      // use issuance ISIN as token symbol
        uint256 totalSupply;    // finalSize divided by facevalue
    }

    /// This represents an unique issuance
    struct DealIssuance {
        string ISIN;    // the 12-digit unique identifier of an issuance

        string dealName;
        uint256 initSize;   // front-end needs to pass this value in units of our stablecoin of choice
        uint256 minSize;    // minimum launch size, same unit of measurement as above
        uint256 faceValue;  // it represents value of 1 deal token (the min investment unit); same unit of measurement as above
        uint offerStartTime;    // use deal creation time block timestamp for now
        uint offerCloseTime;    // either a fixed date/time, or a reletive one (i.e. 5 days after offerStartTime). For now use fixed
        uint issueDate;         // use offerCloseTime as issueDate for now, but keep the field open for issuer flexibility
        uint256 tenor;          // number of seconds, minutes, hours, days, or weeks (no more years since v0.5.0 due to leap seconds concerns). For now use number of DAYS
        uint maturityDate;      // issueDate + tenor
        uint256 interestRate;   // either floating or fixed. Assuming fixed rate for now (i.e. 2,125 means 2.125%)
        uint[] interestPaymentDates;    // for now start with zero-coupon bond (meaning no interim coupons but bond selling at a discount to face value); keep the field for future dev
        uint256 upfrontFee;     // this is the fee Issuer wants to charge for the issuance (i.e. 2,000 means 2% fee of total issue size)

        uint256 finalSize;      // this is the final issuance size, determined by min(initSize, total investor bids), and only if total investor bids >= minSize

        Token token;
        State state;
        bool isOfferLive;

        address issuer;

        address[] investors;
        uint256 investorCount;
        uint256 totalInvestorBid;
        mapping(address => uint256) investorBid;

    }

    uint256 public dealCount;       // total number of deals been issued by PrimeDeFi dApp
    mapping(string => DealIssuance) deals;      // map out ISIN to DealIssuance struct object

    uint256 public issuerCount;     // total number of issuers on PrimeDeFi dApp
    mapping(address => Issuer) issuers;     // map out issuer wallet address to Issuer struct object

    uint256 public investorCount;     // total number of unique investors on PrimeDeFi dApp
    mapping(address => Investor) investors;     // map out investor wallet address to Investor struct object

    uint256 primeDeFiFee;   // this is the fee our dapp charges; Assume a flat 5% of total issue size for now


    /// PLACEHOLDER for Modifiers
    modifier isOfferLive(string memory _ISIN) {
        require(deals[_ISIN].isOfferLive, "Issuance offer period is NOT live");
        _;
    }
    /*
    ...Add more modifiers here...
    */


    /**
     * @dev Constructor can be emitted for now
     */
    //    constructor() {}

    /**
     * @dev Contract Destructor - Mortal design pattern to destroy contract and remove from blockchain
     *
    function kill() public onlyOwner {
        selfdestruct(address(uint160(owner()))); /// cast owner to address payable
    }
    */

    /**
     * @dev Functions to display the internal state (Pass in sender address manually
     *     coz truffle proxy contracts interfer with msg.sender)
     */

    /**
    * @dev Set issuer details - No need for this function now - issuer details will be handled at the front-end
    */
    /**
    function setIssuerDetails(address _addr, string memory _name, string memory _creditRating) public {
        Issuer memory issuer = issuers[_addr];
        emit LogSetIssuerDetails(_addr, _name, _creditRating);
    } */

    /**
    * @dev Edit issuer details - No need right now
    */
    /**
    function editIssuerDetails(address _addr) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: editIssuerDetails: Caller is NOT the issuer");
        emit LogEditIssuerDetails(_addr);
    }
    */

    /**
    * @dev Get issuer details
    */
    function getIssuerDetails() public view returns(string[] memory dealsIssued) {
        return( issuers[msg.sender].dealsIssued );
    }


    /**
    * @dev Set invetor details - no need for this function right now
    */
    //function setInvestorDetails(address _addr) public {}

    /**
    * @dev Get invetor details
    */
    function getInvestorDetails() public view returns(
        string[] memory dealsBidded,
        uint256 totalBalance,
        uint256 totalLockedInBid,
        uint256 availBalance
        ) {
        return( investors[msg.sender].dealsBidded, investors[msg.sender].totalBalance, investors[msg.sender].totalLockedInBid, investors[msg.sender].availBalance );
    }

    /**
    * @dev Edit invetor details - no need right now
    */
    /**
    function editInvestorDetails(address _addr) public {
        require(msg.sender == investors[_addr].addr, "DEAL:: editInvestorDetails: Caller is NOT the investor");
        emit LogEditInvestorDetails(_addr);
    }
    */


    function getDealIssuance(string memory _ISIN) public view returns(
        string memory dealName,
        uint256 initSize,
        uint256 minSize,
        uint256 faceValue,
        uint offerStartTime,
        uint offerCloseTime,
        uint256 tenor,
        uint256 interestRate,
        uint256 upfrontFee
        )
    {
        dealName = deals[_ISIN].dealName;
        initSize = deals[_ISIN].initSize;
        minSize = deals[_ISIN].minSize;
        faceValue = deals[_ISIN].faceValue;
        offerStartTime = deals[_ISIN].offerStartTime;
        offerCloseTime = deals[_ISIN].offerCloseTime;
        tenor = deals[_ISIN].tenor;
        interestRate = deals[_ISIN].interestRate;
        upfrontFee = deals[_ISIN].upfrontFee;

        return( dealName, initSize, minSize, faceValue, offerStartTime, offerCloseTime, tenor, interestRate, upfrontFee );
    }

    /**
    * @dev Update details of a deal issuance after it's created & before the offer period is closed
    */
    /* For now we do not allow issuers to change ISIN and faceValue */
    function editDealIssuance(
        string memory _ISIN,
        string memory _newDealName,
        uint256 _newInitSize,
        uint256 _newMinSize,
        uint _newOfferCloseTime,
        uint256 _newTenor,
        uint256 _newInterestRate,
        uint256 _newUpfrontFee
        ) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: editDealIssuance: Caller is NOT the issuer");
        require(deals[_ISIN].isOfferLive, "DEAL:: editDealIssuance: You cannot edit an issuance when it is NOT live");

        deals[_ISIN].dealName = _newDealName;
        deals[_ISIN].initSize = _newInitSize;
        deals[_ISIN].minSize = _newMinSize;
        deals[_ISIN].offerCloseTime = _newOfferCloseTime;
        deals[_ISIN].tenor = _newTenor;
        deals[_ISIN].interestRate = _newInterestRate;
        deals[_ISIN].upfrontFee = _newUpfrontFee;

        emit LogEditDealIssuance( msg.sender, _ISIN, _newDealName, _newInitSize, _newMinSize, _newOfferCloseTime, _newTenor, _newInterestRate, _newUpfrontFee );
    }

    /**
    * @dev Set token details for the corresponding new issuance
    */
    function setTokenDetails(string memory _ISIN, string memory _name) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: setTokenDetails: Caller is NOT the issuer");

        deals[_ISIN].token.issuer = msg.sender;
        deals[_ISIN].token.name = _name;
        deals[_ISIN].token.symbol = _ISIN;
    }

    /**
    * @dev get token details for the corresponding issuance
    */
    function getTokenDetails(string memory _ISIN) public view returns(
        string memory tokenName,
        string memory symbol,
        uint256 totalSupply
        ) {
        return( deals[_ISIN].token.name, deals[_ISIN].token.symbol, deals[_ISIN].token.totalSupply );
    }

      /**
    * @dev edit token details for the corresponding issuance (will decide relevance of state later on)
    */
    function editTokenDetails(string memory _ISIN, string memory _newName) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: editTokenDetails: Caller is NOT the issuer");

        deals[_ISIN].token.name = _newName;
        //deals[_ISIN].token.symbol = _ISIN;

        emit LogEditTokenDetails( msg.sender, _ISIN, _newName );
    }

    /**
    * @dev Create a new deal issuance & set its details in storage
    */
    function createDealIssuance(
        //address _issuer,
        string memory _ISIN,
        string memory _dealName,
        uint256 _initSize,
        uint256 _minSize,
        uint256 _faceValue,
        //uint _offerStartTime,
        uint _offerCloseTime,
        uint256 _tenor,
        uint256 _interestRate,
        uint256 _upfrontFee
        ) public {
        DealIssuance storage issuance = deals[_ISIN];

        issuance.issuer = msg.sender;
        issuance.ISIN = _ISIN;
        issuance.dealName = _dealName;
        issuance.initSize = _initSize;
        issuance.minSize = _minSize;
        issuance.faceValue = _faceValue;
        issuance.offerStartTime = block.timestamp;  // assuming offer period starts immediately after issuer creates the new issuance
        issuance.offerCloseTime = _offerCloseTime;
        issuance.tenor = _tenor;
        issuance.interestRate = _interestRate;
        issuance.upfrontFee = _upfrontFee;

        issuance.state = State.OFFERLIVE;
        issuance.isOfferLive = true;
        dealCount += 1;

        issuers[msg.sender].dealsIssued.push() = _ISIN;

        emit LogCreateDealIssuance(msg.sender, _ISIN, _dealName, _initSize, _minSize, _faceValue, issuance.offerStartTime, _offerCloseTime, _tenor, _interestRate, _upfrontFee);
    }

    /**
    * @dev Close deal offering (book-building) process; need be go triggered by Chainlink oracle when timestamp reaches offerCloseTime
    */
    function closeDealOffering(string memory _ISIN) public returns(bool) {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: closeDealOffering: Caller is NOT the issuer");
        require(deals[_ISIN].isOfferLive, "DEAL:: closeDealOffering: You cannot close a deal offering which is NOT live");

        deals[_ISIN].state = State.OFFERCLOSED;

        bool toLaunch = assessDealOfferingFinalStatus(_ISIN);

        if(!toLaunch) {
            cancelDeal(_ISIN);
            return false;       // return false means deal is cancelled
        } else {
            createToken(_ISIN);
            // TBD: Allocate token by investor bid amount propotion
            // TBD: Transfer stablecoins from investor wallets to deal escrow account according to the allocation amount
            deals[_ISIN].state = State.ISSUED;
            return true;
        }
    }

    /**
    * @dev count total investor bids; assess whether to launch and corresponding actions
    */
    function assessDealOfferingFinalStatus(string memory _ISIN) internal returns(bool) {
        if(deals[_ISIN].totalInvestorBid >= deals[_ISIN].minSize) {
            deals[_ISIN].finalSize = Math.min(deals[_ISIN].totalInvestorBid, deals[_ISIN].initSize);
            return true;
        } else {
            return false;
        }
    }

    /**
    * @dev Cancel the deal issuance - either becoz total investor bid < minSize, or some other reasons
    */
    function cancelDeal(string memory _ISIN) public {
        //DealIssuance storage issuance = deals[_ISIN];
        deals[_ISIN].state = State.CANCELLED;
        deals[_ISIN].isOfferLive = false;

        emit LogCancelDeal( deals[_ISIN].issuer, _ISIN);
    }

    function createToken(string memory _ISIN) internal {
        //require(msg.sender == _issuer, "Only issuer can create token for this issuance.");
        deals[_ISIN].token.totalSupply = calcTotalSupply(deals[_ISIN].finalSize, deals[_ISIN].faceValue);
        DealTokenFactory factory = new DealTokenFactory();
        deals[_ISIN].token.dealtoken = factory.createToken(deals[_ISIN].token.name, deals[_ISIN].token.symbol, deals[_ISIN].token.totalSupply);

        emit LogCreatToken( deals[_ISIN].issuer, _ISIN, deals[_ISIN].token.name, deals[_ISIN].token.symbol, deals[_ISIN].token.totalSupply );
    }

    function calcTotalSupply(uint256 _size, uint256 _faceValue) internal pure returns(uint256) {
        return SafeMath.div(_size, _faceValue);
    }


/// The following functions need to be implemented

    function allocateToken(string memory _ISIN) internal {
        //...function logic goes here..
    }

    function issuanceFundTransfer(string memory _ISIN) internal {
        //...function logic goes here...
    }



    function makeBid(string memory _ISIN, address _addr, uint256 _bidAmount) external {
        //......
    }

    function getBidDetails(string memory _ISIN, address _addr) external {
        //......
    }

    function editBid(string memory _ISIN, address _addr) external {
        //......
    }

    function cancelBid(string memory _ISIN, address _addr) external {
        //......
    }


/**
    function issuerTopUpEscrowFund(string memory _ISIN) public payable {
        issuers[msg.sender][_ISIN].escrowBalance += msg.value;
    }

    function issuerWithdrawFund(address payable _issuerExternalAddr, string memory _ISIN, uint256 _amount) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: issuerWithdrawFund: Caller is NOT the issuer");
        require(_amount <= issuers[msg.sender][_ISIN].availableBalance, "DEAL:: issuerWithdrawFund: Not enough available fund");

        issuers[msg.sender][_ISIN].availableBalance -= _amount;
        _issuerExternalAddr.transfer(_amount);
    }

    function investorMakeDeposit() public payable {
        investors[msg.sender].totalBalance += msg.value;
    }

    function investorMakeWithdrawal(address _addr, uint256 _amount) external {
        //......
    }

*/

/**
    function payInterimCoupon()

    function redeemAtMaturity()

    function handleDefaultEvent()
*/

}
        uint256 investorCount;
        uint256 totalInvestorBid;
        mapping(address => uint256) investorBid;
    }

    uint256 public dealCount;       // total number of deals been issued by PrimeDeFi dApp
    mapping(string => DealIssuance) deals;      // map out ISIN to DealIssuance struct object

    uint256 public issuerCount;     // total number of issuers on PrimeDeFi dApp
    mapping(address => Issuer) issuers;     // map out issuer wallet address to Issuer struct object

    uint256 public investorCount;     // total number of unique investors on PrimeDeFi dApp
    mapping(address => Investor) investors;     // map out investor wallet address to Investor struct object

    uint256 primeDeFiFee;   // this is the fee our dapp charges; Assume a flat 5% of total issue size for now


    /// PLACEHOLDER for Modifiers
    modifier isOfferLive(string memory _ISIN) {
        require(deals[_ISIN].isOfferLive, "Issuance offer period is NOT live");
        _;
    }
    /*
    ...Add more modifiers here...
    */


    /**
     * @dev Constructor can be emitted for now
     */
    //    constructor() {}

    /**
     * @dev Contract Destructor - Mortal design pattern to destroy contract and remove from blockchain
     *
    function kill() public onlyOwner {
        selfdestruct(address(uint160(owner()))); /// cast owner to address payable
    }
    */

    /**
     * @dev Functions to display the internal state (Pass in sender address manually
     *     coz truffle proxy contracts interfer with msg.sender)
     */

    /**
    * @dev Set issuer details - No need for this function now - issuer details will be handled at the front-end
    */
    /**
    function setIssuerDetails(address _addr, string memory _name, string memory _creditRating) public {
        Issuer memory issuer = issuers[_addr];
        emit LogSetIssuerDetails(_addr, _name, _creditRating);
    } */

    /**
    * @dev Edit issuer details - No need right now
    */
    /**
    function editIssuerDetails(address _addr) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: editIssuerDetails: Caller is NOT the issuer");
        emit LogEditIssuerDetails(_addr);
    }
    */

    /**
    * @dev Get issuer details
    */
    function getIssuerDetails() public view returns(string[] memory dealsIssued) {
        return( issuers[msg.sender].dealsIssued );
    }


    /**
    * @dev Set invetor details - no need for this function right now
    */
    //function setInvestorDetails(address _addr) public {}

    /**
    * @dev Get invetor details
    */
    function getInvestorDetails() public view returns(
        string[] memory dealsBidded,
        uint256 totalBalance,
        uint256 totalLockedInBid,
        uint256 availBalance
        ) {
        return( investors[msg.sender].dealsBidded, investors[msg.sender].totalBalance, investors[msg.sender].totalLockedInBid, investors[msg.sender].availBalance );
    }

    /**
    * @dev Edit invetor details - no need right now
    */
    /**
    function editInvestorDetails(address _addr) public {
        require(msg.sender == investors[_addr].addr, "DEAL:: editInvestorDetails: Caller is NOT the investor");
        emit LogEditInvestorDetails(_addr);
    }
    */


    function getDealIssuance(string memory _ISIN) public view returns(
        string memory dealName,
        uint256 initSize,
        uint256 minSize,
        uint256 faceValue,
        uint offerStartTime,
        uint offerCloseTime,
        uint256 tenor,
        uint256 interestRate,
        uint256 upfrontFee
        )
    {
        dealName = deals[_ISIN].dealName;
        initSize = deals[_ISIN].initSize;
        minSize = deals[_ISIN].minSize;
        faceValue = deals[_ISIN].faceValue;
        offerStartTime = deals[_ISIN].offerStartTime;
        offerCloseTime = deals[_ISIN].offerCloseTime;
        tenor = deals[_ISIN].tenor;
        interestRate = deals[_ISIN].interestRate;
        upfrontFee = deals[_ISIN].upfrontFee;

        return( dealName, initSize, minSize, faceValue, offerStartTime, offerCloseTime, tenor, interestRate, upfrontFee );
    }

    /**
    * @dev Update details of a deal issuance after it's created & before the offer period is closed
    */
    /* For now we do not allow issuers to change ISIN and faceValue */
    function editDealIssuance(
        string memory _ISIN,
        string memory _newDealName,
        uint256 _newInitSize,
        uint256 _newMinSize,
        uint _newOfferCloseTime,
        uint256 _newTenor,
        uint256 _newInterestRate,
        uint256 _newUpfrontFee
        ) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: editDealIssuance: Caller is NOT the issuer");
        require(deals[_ISIN].isOfferLive, "DEAL:: editDealIssuance: You cannot edit an issuance when it is NOT live");

        deals[_ISIN].dealName = _newDealName;
        deals[_ISIN].initSize = _newInitSize;
        deals[_ISIN].minSize = _newMinSize;
        deals[_ISIN].offerCloseTime = _newOfferCloseTime;
        deals[_ISIN].tenor = _newTenor;
        deals[_ISIN].interestRate = _newInterestRate;
        deals[_ISIN].upfrontFee = _newUpfrontFee;

        emit LogEditDealIssuance( msg.sender, _ISIN, _newDealName, _newInitSize, _newMinSize, _newOfferCloseTime, _newTenor, _newInterestRate, _newUpfrontFee );
    }

    /**
    * @dev Set token details for the corresponding new issuance
    */
    function setTokenDetails(string memory _ISIN, string memory _name) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: setTokenDetails: Caller is NOT the issuer");

        deals[_ISIN].token.issuer = msg.sender;
        deals[_ISIN].token.name = _name;
        deals[_ISIN].token.symbol = _ISIN;
    }

    /**
    * @dev get token details for the corresponding issuance
    */
    function getTokenDetails(string memory _ISIN) public view returns(
        string memory tokenName,
        string memory symbol,
        uint256 totalSupply
        ) {
        return( deals[_ISIN].token.name, deals[_ISIN].token.symbol, deals[_ISIN].token.totalSupply );
    }

      /**
    * @dev edit token details for the corresponding issuance (will decide relevance of state later on)
    */
    function editTokenDetails(string memory _ISIN, string memory _newName) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: editTokenDetails: Caller is NOT the issuer");

        deals[_ISIN].token.name = _newName;
        //deals[_ISIN].token.symbol = _ISIN;

        emit LogEditTokenDetails( msg.sender, _ISIN, _newName );
    }

    /**
    * @dev Create a new deal issuance & set its details in storage
    */
    function createDealIssuance(
        //address _issuer,
        string memory _ISIN,
        string memory _dealName,
        uint256 _initSize,
        uint256 _minSize,
        uint256 _faceValue,
        //uint _offerStartTime,
        uint _offerCloseTime,
        uint256 _tenor,
        uint256 _interestRate,
        uint256 _upfrontFee
        ) public {
        DealIssuance storage issuance = deals[_ISIN];

        issuance.issuer = msg.sender;
        issuance.ISIN = _ISIN;
        issuance.dealName = _dealName;
        issuance.initSize = _initSize;
        issuance.minSize = _minSize;
        issuance.faceValue = _faceValue;
        issuance.offerStartTime = block.timestamp;  // assuming offer period starts immediately after issuer creates the new issuance
        issuance.offerCloseTime = _offerCloseTime;
        issuance.tenor = _tenor;
        issuance.interestRate = _interestRate;
        issuance.upfrontFee = _upfrontFee;

        issuance.state = State.OFFERLIVE;
        issuance.isOfferLive = true;
        dealCount += 1;

        issuers[msg.sender].dealsIssued.push() = _ISIN;

        emit LogCreateDealIssuance(msg.sender, _ISIN, _dealName, _initSize, _minSize, _faceValue, issuance.offerStartTime, _offerCloseTime, _tenor, _interestRate, _upfrontFee);
    }

    /**
    * @dev Close deal offering (book-building) process; need be go triggered by Chainlink oracle when timestamp reaches offerCloseTime
    */
    function closeDealOffering(string memory _ISIN) public returns(bool) {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: closeDealOffering: Caller is NOT the issuer");
        require(deals[_ISIN].isOfferLive, "DEAL:: closeDealOffering: You cannot close a deal offering which is NOT live");

        deals[_ISIN].state = State.OFFERCLOSED;

        bool toLaunch = assessDealOfferingFinalStatus(_ISIN);

        if(!toLaunch) {
            cancelDeal(_ISIN);
            return false;       // return false means deal is cancelled
        } else {
            createToken(_ISIN);
            // Allocate token by investor bid amount propotion
            // Transfer stablecoins from investor wallets to deal escrow account according to the allocation amount
            deals[_ISIN].state = State.ISSUED;
            return true;
        }
    }

    /**
    * @dev count total investor bids; assess whether to launch and corresponding actions
    */
    function assessDealOfferingFinalStatus(string memory _ISIN) internal returns(bool) {
        if(deals[_ISIN].totalInvestorBid >= deals[_ISIN].minSize) {
            deals[_ISIN].finalSize = Math.min(deals[_ISIN].totalInvestorBid, deals[_ISIN].initSize);
            return true;
        } else {
            return false;
        }
    }

    /**
    * @dev Cancel the deal issuance - either becoz total investor bid < minSize, or some other reasons
    */
    function cancelDeal(string memory _ISIN) public {
        //DealIssuance storage issuance = deals[_ISIN];
        deals[_ISIN].state = State.CANCELLED;
        deals[_ISIN].isOfferLive = false;

        emit LogCancelDeal( deals[_ISIN].issuer, _ISIN);
    }

    function createToken(string memory _ISIN) internal {
        //require(msg.sender == _issuer, "Only issuer can create token for this issuance.");
        deals[_ISIN].token.totalSupply = calcTotalSupply(deals[_ISIN].finalSize, deals[_ISIN].faceValue);
        DealTokenFactory factory = new DealTokenFactory();
        deals[_ISIN].token.dealtoken = factory.createToken(deals[_ISIN].token.name, deals[_ISIN].token.symbol, deals[_ISIN].token.totalSupply);

        emit LogCreatToken( deals[_ISIN].issuer, _ISIN, deals[_ISIN].token.name, deals[_ISIN].token.symbol, deals[_ISIN].token.totalSupply );
    }

    function calcTotalSupply(uint256 _size, uint256 _faceValue) internal pure returns(uint256) {
        return SafeMath.div(_size, _faceValue);
    }


    function allocateToken() internal {
        //...function logic goes here..
    }

    function transferBidAmountAllocated() internal {
        //...function logic goes here...
    }




/*    function makeBid(string memory _ISIN, address _addr, uint256 _bidAmount) external {
        //......
    }

    function getBidDetails(string memory _ISIN, address _addr) external {}

    function editBid(string memory _ISIN, address _addr) external {
        //......
    }

    function cancelBid(string memory _ISIN, address _addr) external {
        //......
    }
*/


/**
 *
    function issuerTopupEscrowFund(string memory _ISIN) public payable {
        issuers[msg.sender][_ISIN].escrowBalance += msg.value;
    }

    function issuerWithdrawFund(address payable _issuerExternalAddr, string memory _ISIN, uint256 _amount) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: issuerWithdrawFund: Caller is NOT the issuer");
        require(_amount <= issuers[msg.sender][_ISIN].availableBalance, "DEAL:: issuerWithdrawFund: Not enough available fund");

        issuers[msg.sender][_ISIN].availableBalance -= _amount;
        _issuerExternalAddr.transfer(_amount);
    }

    function investorMakeDeposit() public payable {
        investors[msg.sender].totalBalance += msg.value;
    }

    function investorMakeWithdrawal(address _addr, uint256 _amount) external {
        //......
    }

*/

/**
    function payInterimCoupon()

    function redeemAtMaturity()

    function handleDefaultEvent()
*/

}
