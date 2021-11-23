// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/Pausable.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/Math.sol";

//import "@openzeppelin/contracts/utils/math/SafeMath.sol";
//import "@openzeppelin/contracts/utils/math/Math.sol";

import "./DealToken.sol";
import "./DealTokenFactory.sol";
import "./DealTokenManager.sol";
import "./IssuerSet.sol";
import "./InvestorSet.sol";
import "./DealSet.sol";

/**
 * @title Deal
 * @author 0xYue
 * @notice This contract represents the entire deal issuance book-building process (incl creation of new deals and minting/allocation of the deal token
 * @dev USDC stablecoin tracker address needs to be changed to Ethereum mainnet when we're ready to deploy
 * @dev To link libraries developed to check existing issuer/investor/deal before adding new ones with this main contract!!
 * @dev Oversized now!!! Must break this into a few separate contracts such as Helper functions, event interface, etc.
 * @dev To add @param to all sub-functions
 * @dev To implement all Ownable and Pausible functions
 * @dev To finalize all events and Modifiers
 * @dev To check and finalize all function visibilities
 * @dev To implement more search functions
 * @dev To use SafeMath at all places (incl ++ calculations)
 * @dev To change to SafeERC20 functions later
 * @dev To integrate with Chainlink oracle adaptors and keepers
 * @dev To implement decimals to our DealToken
 * @dev To implement global fee
 */
//contract Deal is Ownable {
contract Deal {
    /// Libraries
    //using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using SafeMath for uint;

    //using IssuerSet for Issuer;
    //using DealSet for DealIssuance;
    //using InvestorSet for Investor;

    event LogCreateIssuer(address indexed _issuer, string _name, string _creditRating);
    event LogEditIssuerMetaData(address indexed _issuer, string _name, string _creditRating);

    event LogCreateDealIssuance(
        address indexed _issuer,
        string indexed _ISIN,
        string _dealName,
        uint256 _initSize,
        uint256 _minSize,
        uint256 _faceValue,
        uint256 _offerPrice,
        uint _offerStartTime,
        uint _offerCloseTime,
        uint256 _term,
        uint256 _interestRate,
        uint[] _interestPaymentDates,
        uint256 _upfrontFee
        //uint256 _escrowRatio
        );

    event LogEditDealIssuance(
        address indexed _issuer,
        string indexed _ISIN,
        string _newDealName,
        uint256 _newInitSize,
        uint256 _newMinSize,
        uint256 _newOfferPrice,
        uint _newOfferCloseTime,
        uint256 _newTerm,
        uint256 _newInterestRate,
        uint[] _newInterestPaymentDates,
        uint256 _newUpfrontFee,
        uint256 _newEscrowRatio
        );

    event LogEditTokenMetaData(address indexed _issuer, string indexed _ISIN, string _newName);
    event LogCreateToken(address indexed _issuer, string indexed _ISIN, string _name, string _symbol, uint256 _totalSupply);

    event LogCancelDeal(address indexed _issuer, string indexed _ISIN);
    event LogIssueNewDeal(address indexed _issuer,  string indexed _ISIN, address _token, uint256 _finalSize, address[] _investors );

    event LogTransferDealToken(string indexed _ISIN, address _token, address _investorAddr, uint256 _tokenAmount);

    /*
    enum State {
        INACTIVE,       // before deal issuance creation, default state
        OFFERLIVE,      // offer period has started but not closed
        OFFERCLOSED,    // offer period has closed out but investment/tokens not allocated yet
        ISSUED,         // investment/tokens have been allocated and official issuance started
        CANCELLED,      // deal issuance has been cancelled due to insuffient fund raised, or other reasons
        REDEEMED        // the end of deal lifecycle - maturity or early redemption; principle investment and any last coupons are paid out, all o/s deal tokens are destroyed
    }

    struct Token {
        address tokenAddr;
        address issuer;
        string name;
        string symbol;      // use issuance ISIN as token symbol
        uint256 totalSupply;    // finalSize divided by facevalue
    }

    struct DealIssuance {
        string ISIN;    // the 12-digit unique identifier of an issuance

        string dealName;
        uint256 initSize;   // front-end needs to pass this value in units of our stablecoin of choice
        uint256 minSize;    // minimum launch size, same unit of measurement as above
        uint256 faceValue;  // it represents value of 1 deal token (the min investment unit); same unit of measurement as above
        uint256 offerPrice;     // price of the bond, typically 100% of faceValue, can also be at a premium or discount
        uint offerStartTime;    // use deal creation time block timestamp for now
        uint offerCloseTime;    // either a fixed date/time, or a reletive one (i.e. 5 days after offerStartTime). For now use fixed
        uint issueDate;         // use offerCloseTime as issueDate for now, but keep the field open for issuer flexibility
        uint256 term;           // number of seconds, minutes, hours, days, or weeks (no more years since v0.5.0 due to leap seconds concerns). For now use number of DAYS
        uint maturityDate;      // issueDate + tenor
        uint256 interestRate;   // either floating or fixed. Assuming fixed rate for now (i.e. 2,125 means 2.125%)
        uint[] interestPaymentDates;    // for now start with zero-coupon bond (meaning no interim coupons but bond selling at a discount to face value); keep the field for future dev
        uint256 upfrontFee;     // this is the fee Issuer wants to charge for the issuance (i.e. 2,000 means 2% fee of total issue size)
        uint256 escrowRatio;   // for now use 5% of total size; later on change to more specific, i.e. 1 or 2 coupon payments equivalent

        uint256 finalSize;      // this is the final issuance size, determined by min(initSize, total investor bids), and only if total investor bids >= minSize
        uint256 totalEscrowAmount;

        Token token;
        State state;
        bool isOfferLive;
        bool isOfferClosed;
        mapping( string => bool ) isExistingISIN;   // map out ISIN to whether ISIN's been used in existing issuance

        address issuer;
        address[] investors;

        uint256 investorCount;
        uint256 totalInvestorBid;
        mapping( address => bool ) investorAlreadyBid;
    }

    struct Issuer {
        address addr;
        string name;
        string creditRating;
        mapping(address => bool) isExisting;
        string[] dealsIssued;    // A vector of issuance ISINs

        uint256 totalIssuedAmount;
        uint256 totalEscrowFundLockedIn;
        uint256 totalAvailBalance;

        mapping(string => uint256) finalSize;   // mapping deal ISIN to final size raised for that issuance, including escrow allocation
        mapping(string => uint256) escrowFundLockedIn;   //mapping deal ISIN to allocated escrow fund lock-in in Issuer wallet for that particular issuance
        mapping(string => uint256) availBalance;    //mapping deal ISIN to available balance of the Issuer wallet (finalSize - escrow at the beginning; can be zero in between payment dates; must have enough fund 5bd before next payment date)
    }

    struct Investor {
        address addr;
        mapping(address => bool) isExisting;
        string[] dealsBidded;  // a ventor of the deal issuance ISINs the investor has participated in bidding

        uint256 totalBalance;       // in terms of stablecoin
        uint256 totalLockedInBid;   // in terms of stablecoin
        uint256 availBalance;       // totalBalance minus totalLockedInBid

        mapping(string => bool) isOfferClosed;      // mapping deal ISIN to a boolean; "true" means that the issuance offer period is closed
        mapping(string => bool) isBidSuccessful;    // mapping deal ISIN to a boolean; "true" means that investor'd bid to an issuance is successful
        mapping(string => uint256) lockedInBid;     // mapping deal ISIN to investment amount the investor has allocated to that deal
    }
    */

    address private owner;          // dapp owner address
    uint256 private balance;        // balance of the Deal contract wallet
    uint256 private globalFee;              // this is the fee our dapp charges; Assume a flat 5% of total issue size for now
    uint256 private feeRateDecimal;         // use 3 for now
    uint256 private percentageDecimal;     // this is used in percentage calculations

    uint256 public dealCount;       // total number of deals created in the dapp
    mapping( string => DealIssuance ) deals;    // map out ISIN to DealIssuance struct object

    uint256 public issuerCount;     // total number of issuers in the dapp
    mapping( address => Issuer ) issuers;     // map out issuer address to Issuer struct object

    uint256 public totalInvestorCount;     // total number of investors in the dApp
    mapping( address => Investor ) investors;     // map out investor address to Investor struct object

    DealTokenFactory public factory;
    DealTokenManager public manager;

    uint256 public tokenCount;
    mapping(address => address[]) public tracker_0x_addresses;  // map out issuer address to a vector of addresses of DealTokens issued

    // USD Coin tracker address on Ethereum mainnet
    //address public constant USDC = 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48;
    // USD Coin tracker address on Kovan test net
    address public constant USDC = 0xe22da380ee6B445bb8273C81944ADEB6E8450422;


    // =========================
    /// PLACEHOLDER for Modifiers
    modifier isOfferLive(string memory _ISIN) {
        require(deals[_ISIN].isOfferLive, "Issuance offer period is NOT live");
        _;
    }

    modifier isOfferClosed(string memory _ISIN) {
        require(deals[_ISIN].isOfferClosed, "Issuance offer period is NOT closed yet");
        _;
    }

    modifier inState(DealIssuance storage _deal, State _state) {
        require(
            _deal.state == _state,
            "Invalid state."
        );
        _;
    }
    ///...Add more modifiers here...


    /**
     * @notice Constructor
     */
    constructor() {
        owner = msg.sender;
        globalFee = 5000;   // this represents 5% when feeRateDecimal = 3 (for now)
        feeRateDecimal = 3;
        percentageDecimal = 2;
        factory = new DealTokenFactory();
        manager = new DealTokenManager();
    }

    /*
    receive() payable external {
        balance += msg.value;
    } */

    /**
     * @dev Contract Destructor - Mortal design pattern to destroy contract and remove from blockchain
     *
    function kill() public onlyOwner {
        selfdestruct(address(uint160(owner()))); /// cast owner to address payable
    }
    */

    /**
    * @notice Create issuer & set meta data details
    */
    function createIssuer(string memory _name, string memory _creditRating) public {
        Issuer storage issuer = issuers[msg.sender];
        //require(issuer.insert(msg.sender));   // Using my Library IssuerSet here

        issuer.name = _name;
        issuer.creditRating = _creditRating;

        issuerCount++;
        emit LogCreateIssuer(msg.sender, _name, _creditRating);
    }

    /**
    * @notice Edit issuer meta data
    */
    function editIssuerMetaData(address _addr, string memory _newName, string memory _newCreditRating) public {
        require(msg.sender == _addr, "DEAL:: editIssuerDetails: Caller is NOT the issuer");
        issuers[_addr].name = _newName;
        issuers[_addr].creditRating = _newCreditRating;

        emit LogEditIssuerMetaData(_addr, _newName, _newCreditRating);
    }

    /**
    * @notice Edit issuer details after new deal offer is closed and set to launch
    */
    function editIssuerDetailsPostNewIssuance(string memory _ISIN, address _addr) internal {
        DealIssuance storage deal = deals[_ISIN];
        Issuer storage _issuer = issuers[_addr];

        _issuer.dealsIssued.push() = _ISIN;
        _issuer.totalIssuedAmount = safeAdd(_issuer.totalIssuedAmount, deal.finalSize);
        _issuer.totalEscrowFundLockedIn = safeAdd(_issuer.totalEscrowFundLockedIn, deal.totalEscrowAmount);
        _issuer.totalAvailBalance = safeSub(_issuer.totalIssuedAmount, _issuer.totalEscrowFundLockedIn);

        _issuer.finalSize[_ISIN] = deal.finalSize;
        _issuer.escrowFundLockedIn[_ISIN] = deal.totalEscrowAmount;
        _issuer.availBalance[_ISIN] = deal.finalSize - deal.totalEscrowAmount;
    }

    /**
    * @notice Edit investor details after new deal offer is closed and set to launch
    */
    function editInvestorDetailsPostNewIssuance(string memory _ISIN, Investor storage _investor) internal {
        _investor.isOfferClosed[_ISIN] = true;
        _investor.isBidSuccessful[_ISIN] = true;
    }

    /**
    * @notice Get all issuer details by issuer address; must be called by issuer
    */
    function getAllIssuerDetailsByAddr(address _addr) public view returns(
        string memory name,
        string memory creditRating,
        string[] memory dealsIssued,
        uint256 totalIssuedAmount,
        uint256 totalEscrowFundLockedIn,
        uint256 totalAvailBalance)
    {
        require(msg.sender == _addr, "DEAL:: getAllIssuerDetailsByAddr: Caller is NOT the issuer");

        Issuer storage issuer = issuers[_addr];
        return(
            issuer.name,
            issuer.creditRating,
            issuer.dealsIssued,
            issuer.totalIssuedAmount,
            issuer.totalEscrowFundLockedIn,
            issuer.totalAvailBalance
        );
    }

    /**
    * @notice Get public issuer details by issuance ISIN
    */
    function getIssuerMetaDataByISIN(string memory _ISIN) public view returns(
        string memory issuerName,
        string memory creditRating)
    {
        return( issuers[deals[_ISIN].issuer].name, issuers[deals[_ISIN].issuer].creditRating );
    }

    /**
    * @dev Get investor details - investors can view their own details via this function call
    */
    function getAllInvestorDetails(address _addr) public view returns(
        string[] memory dealsBidded,
        uint256 totalBalance,
        uint256 totalLockedInBid,
        uint256 availBalance)
    {
        require(msg.sender == _addr, "DEAL:: getAllInvestorDetails: Caller is NOT the investor");

        return( investors[_addr].dealsBidded, investors[_addr].totalBalance, investors[_addr].totalLockedInBid, investors[_addr].availBalance );
    }

    /**
    * @notice Get issuance details (state, name, dates, terms) by issuance ISIN
    * @dev split DealIssuance getter functions into a few separate ones, otherwise stack too deep :(
    */
    function getIssuanceStateNameRateDatesDetailsByISIN(string memory _ISIN) public view returns(
        State state,
        string memory dealName,
        uint offerStartTime,
        uint offerCloseTime,
        uint256 term,
        uint256 interestRate,
        uint[] memory interestPaymentDates)
    {
        DealIssuance storage deal = deals[_ISIN];
        return(
            deal.state,
            deal.dealName,
            deal.offerStartTime,
            deal.offerCloseTime,
            deal.term,
            deal.interestRate,
            deal.interestPaymentDates
        );
    }

    /**
    * @notice Get issuance details (size, price, fee, escrow, total invetor bid) by issuance ISIN
    * @dev split DealIssuance getter functions into a few separate ones, otherwise stack too deep :(
    */
    function getIssuanceSizePriceTotalBidDetailsByISIN(string memory _ISIN) public view returns(
        uint256 initSize,
        uint256 minSize,
        uint256 faceValue,
        uint256 offerPrice,
        uint256 upfrontFee,
        uint256 escrowRatio,
        uint256 totalInvestorBid)
    {
        DealIssuance storage deal = deals[_ISIN];
        return(
            deal.initSize,
            deal.minSize,
            deal.faceValue,
            deal.offerPrice,
            deal.upfrontFee,
            deal.escrowRatio,
            deal.totalInvestorBid
        );
    }

    /**
    * @notice Update details of a deal issuance after it's created & before the offer period is closed
    * @dev For now we do NOT allow issuers to change ISIN and faceValue (to avoid stack too deep)
    */
    function editDealIssuance(
        string memory _ISIN,
        string memory _newDealName,
        uint256 _newInitSize,
        uint256 _newMinSize,
        uint256 _newOfferPrice,
        uint _newOfferCloseTime,
        uint256 _newTerm,
        uint256 _newInterestRate,
        uint[] memory _newInterestPaymentDates,
        uint256 _newUpfrontFee,
        uint256 _newEscrowRatio
    ) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: editDealIssuance: Caller is NOT the issuer");
        require(deals[_ISIN].isOfferLive, "DEAL:: editDealIssuance: You cannot edit an issuance when it is NOT live");

        DealIssuance storage deal = deals[_ISIN];

        deal.dealName = _newDealName;
        deal.initSize = _newInitSize;
        deal.minSize = _newMinSize;
        deal.offerPrice = _newOfferPrice;
        deal.offerCloseTime = _newOfferCloseTime;
        deal.term = _newTerm;
        deal.interestRate = _newInterestRate;
        deal.interestPaymentDates = _newInterestPaymentDates;
        deal.upfrontFee = _newUpfrontFee;
        deal.escrowRatio = _newEscrowRatio;

        emit LogEditDealIssuance(
            msg.sender,
            _ISIN,
            _newDealName,
            _newInitSize,
            _newMinSize,
            _newOfferPrice,
            _newOfferCloseTime,
            _newTerm,
            _newInterestRate,
            _newInterestPaymentDates,
            _newUpfrontFee,
            _newEscrowRatio
        );
    }

    /**
    * @notice Create token meta data (name & symbol) for a new issuance
    */
    function createTokenMetaData(string memory _ISIN, string memory _name) public {
        DealIssuance storage deal = deals[_ISIN];
        require(deal.isOfferLive, "DEAL:: createTokenMetaData: Offer is not live");
        require(msg.sender == deal.issuer, "DEAL:: createTokenMetaData: Caller is NOT the issuer");

        deal.token.issuer = msg.sender;
        deal.token.name = _name;
        deal.token.symbol = _ISIN;
    }

    /**
    * @notice Get token details for the corresponding issuance
    */
    function getTokenDetails(string memory _ISIN) public view returns(
        string memory tokenName,
        string memory symbol,
        uint256 totalSupply
        ) {
        return( deals[_ISIN].token.name, deals[_ISIN].token.symbol, deals[_ISIN].token.totalSupply );
    }

    /**
    * @notice Edit token meta data for the corresponding issuance
    */
    function editTokenMetaData(string memory _ISIN, string memory _newName) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: editTokenDetails: Caller is NOT the issuer");
        require(!deals[_ISIN].isOfferClosed, "DEAL:: editTokenMetaData: Offer period is already closed ");

        deals[_ISIN].token.name = _newName;
        deals[_ISIN].token.symbol = _ISIN;
        emit LogEditTokenMetaData( msg.sender, _ISIN, _newName );
    }

    // ====================================================
    /**
    * @notice Create a new deal issuance, set its details in storage, & offer period starts
    * @dev Ignored escrowRatio for now, assuming a fixed 5%
    * @dev Might need to break this into a few separate sub-functions coz stack can become too deep
    */
    function createDealIssuance(
        //address _issuer,
        string memory _ISIN,
        string memory _dealName,
        uint256 _initSize,
        uint256 _minSize,
        uint256 _faceValue,
        uint256 _offerPrice,
        //uint _offerStartTime,
        uint _offerCloseTime,
        uint256 _term,
        uint256 _interestRate,
        uint[] memory _interestPaymentDates,
        uint256 _upfrontFee
        //uint256 _escrowRatio
        ) public {
        DealIssuance storage deal = deals[_ISIN];
        //require(deal.insert(_ISIN));   // Using my Library DealSet here

        deal.issuer = msg.sender;
        deal.ISIN = _ISIN;
        deal.dealName = _dealName;
        deal.initSize = _initSize;
        deal.minSize = _minSize;
        deal.faceValue = _faceValue;
        deal.offerPrice = _offerPrice;
        deal.offerStartTime = block.timestamp;  // assuming offer period starts immediately after issuer creates the new issuance
        deal.offerCloseTime = _offerCloseTime;
        deal.term = _term;
        deal.interestRate = _interestRate;
        deal.interestPaymentDates = _interestPaymentDates;
        deal.upfrontFee = _upfrontFee;
        deal.escrowRatio = 5000;        // this represents 5% with 3 decimals

        deal.state = State.OFFERLIVE;
        deal.isOfferLive = true;
        dealCount++;

        emit LogCreateDealIssuance(msg.sender, _ISIN, _dealName, _initSize, _minSize, _faceValue, _offerPrice, deal.offerStartTime, _offerCloseTime, _term, _interestRate, _interestPaymentDates, _upfrontFee);
    }

    /**
    * @notice Step 1 - Close deal offering (book-building) process;
    *         Step 2 - Decide whether to launch the official issuance period, or cancel;
    *         Step 3 - Mint DealToken for the issuance, calculate investor allocation then allocate accordingly;
    *         Step 4 - Transfer investor fund to escrow account & the rest to issuer wallet;
    *         Step 5 - Transfer deal token from Deal contract to each investor account
    *         Step 6 - Update all relevant details for the issuance, the issuer, and the investors
    * @dev TODIItem - To be integrated with Chainlink keepers when timestamp clicks pre-set offerCloseTime
    */
    function closeDealOffering(string memory _ISIN) public returns(bool) {
        // Need to revise this modifier becoz function will be called by external Chainlink keeper we set up...
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: closeDealOffering: Caller is NOT the issuer");
        require(deals[_ISIN].isOfferLive, "DEAL:: closeDealOffering: Offer cannot be closed because it is NOT live");

        DealIssuance storage deal = deals[_ISIN];

        deal.state = State.OFFERCLOSED;
        deal.isOfferLive = false;
        deal.isOfferClosed = true;

        bool toLaunch = assessDealOfferingFinalStatus(_ISIN);
        uint256 finalSize = deal.finalSize;

        if(!toLaunch) {
            cancelDeal(_ISIN);
            return false;       // return false means offer is cancelled
        } else {
            // deal token is only minted at this stage
            mintToken(_ISIN, deal.issuer);

            // need to be precise to pre-defined feeRateDecimal
            uint256 ratioInDecimal = safeDiv( safeMul( finalSize, 10**feeRateDecimal ), deal.totalInvestorBid );
            uint256 finalAllocation;

            for(uint i=0; i<deal.investors.length; i++) {
                address investorAddr = deal.investors[i];

                // must adjust investor allocation when deal is overbid; no need otherwise
                if(deal.totalInvestorBid > finalSize) {
                    // convert back to normal number without decimals
                    finalAllocation = safeDiv( safeMul( ratioInDecimal, investors[investorAddr].lockedInBid[_ISIN] ), 10**feeRateDecimal );

                    // convert escrowRatio to num w/o decimals, then convert to percentage value before safeMul with finalAllocation
                    deal.totalEscrowAmount = safeAdd( deal.totalEscrowAmount, safeDiv( safeMul( safeDiv( deal.escrowRatio, 10**feeRateDecimal ), finalAllocation ), 10**percentageDecimal ) );

                    investors[investorAddr].lockedInBid[_ISIN] = finalAllocation;
                    // finalSize is capped at initSize; so must adjust allocated investment amount for each investor
                    adjustInvestorAllocation(_ISIN, finalAllocation, investorAddr);
                }
                // deal token & investment stablecoin transfer
                //transferStableCoin(_ISIN, investorAddr, finalAllocation);
                transferStableCoin(investorAddr, finalAllocation);
                transferDealToken(_ISIN, investorAddr, finalAllocation);
                editInvestorDetailsPostNewIssuance(_ISIN, investors[investorAddr]);
            }
            deal.totalInvestorBid = safeDiv( safeMul( ratioInDecimal, deal.totalInvestorBid ), 10**feeRateDecimal );
            deal.state = State.ISSUED;

            editIssuerDetailsPostNewIssuance(_ISIN, deal.issuer);

            emit LogIssueNewDeal( deal.issuer, _ISIN, deal.token.tokenAddr, finalSize, deal.investors );

            return true;    // return true means offer is successfully closed & deal issued
        }
    }

    /**
    * @notice Count total investor bids to assess whether to launch and corresponding actions
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
    * @notice Adjust allocated investment amount for each investor
    * @dev Function is called only when totalInvestorBid > finalSize
    */
    function adjustInvestorAllocation(string memory _ISIN, uint256 _finalAllocation, address _investorAddr) internal {
        Investor storage investor = investors[_investorAddr];

        investor.totalBalance = safeSub(investor.totalBalance, _finalAllocation);
        investor.totalLockedInBid = safeSub(investor.totalLockedInBid, investor.lockedInBid[_ISIN]);
        investor.availBalance = safeSub(investor.totalBalance, investor.totalLockedInBid);
    }

     /**
    * @notice Transfer stablecoin funding from investors to issuer
    */
    //function transferStableCoin(string memory _ISIN, address _investorAddr, uint256 _allocation) internal {
    function transferStableCoin(address _investorAddr, uint256 _allocation) internal {
        // transfer investor fund to dapp wallet, and assuming
        //   the owner of stablecoin tracker account has approved & given alllowance to investor wallet
        //ERC20(USDC).transferFrom(_investorAddr, address(this), _allocation);
    }

    /**
    * @notice Transfer allocated deal tokens to investors
    */
    function transferDealToken(string memory _ISIN, address _investorAddr, uint256 _allocation) internal {
        DealIssuance storage deal = deals[_ISIN];
        address tokenAddr = deal.token.tokenAddr;
        uint256 tokenAmount = safeDiv(_allocation, deal.faceValue);

        manager.transfer(tokenAddr, _investorAddr, tokenAmount);

        emit LogTransferDealToken(_ISIN, tokenAddr, _investorAddr, tokenAmount);
    }

    /**
    * @notice Cancel the deal issuance due to totalInvestorBid < minLaunchSize
    */
    function cancelDeal(string memory _ISIN) internal {
        deals[_ISIN].state = State.CANCELLED;
        emit LogCancelDeal( deals[_ISIN].issuer, _ISIN);
    }

    /**
    * @notice Mint a new token for the new issuance
    * @dev TODOItem - might need to change to private function later
    */
    function mintToken(string memory _ISIN, address _issuerAddr) internal {
        require(msg.sender == _issuerAddr, "DEAL:: mintToken: Caller is NOT the issuer");

        DealIssuance storage deal = deals[_ISIN];
        string memory _name = deal.token.name;
        string memory _symbol = deal.token.symbol;
        uint256 _totalSupply = safeDiv(deal.finalSize, deal.faceValue);
        deal.token.totalSupply = _totalSupply;

        address tokenAddr = factory.createToken(_name, _symbol, _totalSupply);
        manager.setTokenOwner(tokenAddr, address(this));
        DealToken(tokenAddr).increaseAllowance(address(manager), _totalSupply);

        deal.token.tokenAddr = tokenAddr;
        tracker_0x_addresses[_issuerAddr].push() = tokenAddr;
        tokenCount++;

        emit LogCreateToken( _issuerAddr, _ISIN, _name, _symbol, _totalSupply );
    }

    /**
    * @notice Investor deposit stablecoin fund (USDC) into the dapp
    * @dev Implement USDC transfer here after getting some test USDCs
    */
    //function investorMakeDeposit(IERC20 _stableCoin, uint256 _amount) public {
    function investorMakeDeposit(uint256 _amount) public {
        //ERC20(USDC).transfer(address(this), _amount);
        Investor storage investor = investors[msg.sender];

        investor.totalBalance = safeAdd( investor.totalBalance, _amount );
        investor.availBalance = safeAdd( investor.availBalance, _amount );

        // Call library InvestorSet to see if investor already exists
        //if(investor.insert(msg.sender)) {
            totalInvestorCount++;
        //}
        //emit LogInvestorMakeDeposit(msg.sender, _amount);
    }

    /**
    * @notice Investor makes a bid to invest in an issuance during offer period
    */
    function investorMakeBid(string memory _ISIN, uint256 _bidAmount) public {
        DealIssuance storage deal = deals[_ISIN];
        Investor storage investor = investors[msg.sender];

        require(!deal.investorAlreadyBid[msg.sender], "DEAL:: investorMakeBid: you have already made a bid");
        require(deal.isOfferLive, "DEAL:: investorMakeBid: offer is NOT live");
        require(_bidAmount <= investor.totalBalance, "DEAL:: investorMakeBid: insuffient fund");

        deal.totalInvestorBid = safeAdd(deal.totalInvestorBid, _bidAmount);

        investor.dealsBidded.push() = _ISIN;
        investor.totalLockedInBid = safeAdd(investor.totalLockedInBid, _bidAmount);
        investor.availBalance = safeSub(investor.totalBalance, investor.totalLockedInBid);

        //investor.isOfferClosed[_ISIN] = false;
        //investor.isBidSuccessful[_ISIN] = false;
        investor.lockedInBid[_ISIN] = _bidAmount;

        deal.investors.push() = msg.sender;
        deal.investorCount++;
        deal.investorAlreadyBid[msg.sender] = true;
        //*** emit LogInvestorMakeBid(); ***
    }

    /**
    * @notice Investor gets details of a bid made earlier
    */
    function getBidDetails(string memory _ISIN, address _addr) public view returns(
        bool isClosed,
        bool isSuccessful,
        uint256 lockedInAmount)
    {
        Investor storage investor = investors[msg.sender];
        require(msg.sender == _addr, "DEAL:: getBidDetails: Caller is NOT the investor");
        return(
            investor.isOfferClosed[_ISIN],
            investor.isBidSuccessful[_ISIN],
            investor.lockedInBid[_ISIN]
        );
    }

    /**
    * @notice Investor edits an already-placed bid
    * @dev this is only allowed before deal offer period is closed
    */
    function investorEditBid(string memory _ISIN, address _addr, uint256 _newBidAmount) public {
        DealIssuance storage deal = deals[_ISIN];
        Investor storage investor = investors[msg.sender];

        //require(msg.sender == deal.investors[], "DEAL:: investorEditBid: Not an investor for this deal");    // need to verify if msg.sender is an investor for this deal
        require(deals[_ISIN].isOfferLive, "DEAL:: investorEditBid: You cannot change a bid if the offer is NOT live");
        require(deal.investorAlreadyBid[msg.sender], "DEAL:: investorEditBid: you haven't made a bid yet");
        require(_newBidAmount <= investor.totalBalance, "DEAL:: investorEditBid: insuffient fund");

        deal.totalInvestorBid = safeAdd( safeSub( deal.totalInvestorBid, investor.lockedInBid[_ISIN] ), _newBidAmount );

        investor.totalLockedInBid = safeAdd( safeSub( investor.totalLockedInBid, investor.lockedInBid[_ISIN] ), _newBidAmount );
        investor.availBalance = safeSub(investor.totalBalance, investor.totalLockedInBid);

        investor.lockedInBid[_ISIN] = _newBidAmount;
        //*** emit LogInvestorEditBid(); ***
    }



    function investorCancelBid(string memory _ISIN, address _addr) public {
        //......
    }

    function investorWithdraw(address _addr, uint256 _amount) public {
        //......
    }

    /***
    function issuerWithdraw(address payable _issuerExternalAddr, string memory _ISIN, uint256 _amount) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: issuerWithdrawFund: Caller is NOT the issuer");
        require(_amount <= issuers[msg.sender][_ISIN].availableBalance, "DEAL:: issuerWithdrawFund: Not enough available fund");

        issuers[msg.sender][_ISIN].availableBalance -= _amount;
        _issuerExternalAddr.transfer(_amount);
    } */

/// ================================================
    ///*** Helper functions; To be moved to a separate Helper contract ***
    function safeAdd(uint256 _a, uint256 _b) internal pure returns(uint256) {
        return SafeMath.add(_a, _b);
    }

    function safeSub(uint256 _a, uint256 _b) internal pure returns(uint256) {
        return SafeMath.sub(_a, _b);
    }

    function safeMul(uint256 _a, uint256 _b) internal pure returns(uint256) {
        return SafeMath.mul(_a, _b);
    }

    function safeDiv(uint256 _a, uint256 _b) internal pure returns(uint256) {
        return SafeMath.div(_a, _b);
    }

/// ===============================================
/**
    function issuerTopUpEscrow(string memory _ISIN) public {}

    function payInterimCoupon()

    function redeemAtMaturity()

    function handleDefaultEvent()
*/
}
