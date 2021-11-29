// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/Pausable.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/Math.sol";
//import "@openzeppelin/contracts/utils/math/Math.sol";

import "https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
//import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatible.sol";

import "./DealToken.sol";
import "./DealTokenFactory.sol";
import "./DealTokenManager.sol";
import "./IssuerSet.sol";
import "./InvestorSet.sol";
import "./DealSet.sol";
import "./Helpers.sol";
import "./PrimeFiChainLinkClient.sol";

interface IDeal {
    function setIssuerRating(address _addr, string memory _newCreditRating) external;
}

/**
 * @title Deal
 * @author 0xYue
 * @author Pavel - for contribution made to all chainlink oracle related code
 * @notice This contract represents the entire deal issuance book-building process (incl creation of new deals and minting/allocation of the deal token)
 * @dev USDC stablecoin tracker address needs to be changed to Ethereum mainnet when we're ready to deploy
 * @dev To run gas optimization and security audit
 * @dev To link the 3 customized libraries
 * @dev To break this into a few separate pieces to reduce file size
 * @dev To implement Pausible & ReentrancyGuard functions for added security measure
 * @dev To finalize all events and Modifiers
 * @dev To implement more getter functions with different criteria
 * @dev To upgrade from ERC20 to SafeERC20 later
 */
contract Deal is Owner, KeeperCompatibleInterface {
    using SafeMath for uint256;
    using SafeMath for uint;

    using IssuerSet for Issuer;
    using DealSet for DealIssuance;
    using InvestorSet for Investor;

    event LogCreateIssuer(address indexed issuer, string name);
    event LogEditIssuerMetaData(address indexed issuer, string name, string creditRating);

    event LogCreateDealIssuance(
        address indexed issuer,
        string indexed ISIN,
        string dealName,
        uint256 initSize,
        uint256 minSize,
        uint256 faceValue,
        uint256 offerPrice,
        uint offerStartTime,
        uint offerCloseTime,
        uint256 term,
        uint256 interestRate,
        uint[] interestPaymentDates,
        uint256 upfrontFee
        //uint256 _escrowRatio
    );

    event LogEditDealIssuance(
        address indexed issuer,
        string indexed ISIN,
        string newDealName,
        uint256 newInitSize,
        uint256 newMinSize,
        uint256 newOfferPrice,
        uint newOfferCloseTime,
        uint256 newTerm,
        uint256 newInterestRate,
        uint[] newInterestPaymentDates,
        uint256 newUpfrontFee,
        uint256 newEscrowRatio
    );

    event LogEditTokenMetaData(address indexed issuer, string indexed ISIN, string newName);
    event LogCreateToken(address indexed issuer, string indexed ISIN, string name, string symbol, uint256 totalSupply);

    event LogCancelDeal(address indexed issuer, string indexed ISIN);
    event LogIssueNewDeal(address indexed issuer,  string indexed ISIN, address token, uint256 finalSize, address[] investors );

    event LogTransferStableCoin(address indexed investor, uint256 amount);
    event LogTransferDealToken(string indexed ISIN, address token, address investorAddr, uint256 tokenAmount);

    event LogInvestorMakeDeposit(address indexed investor, uint256 amount);
    event LogInvestorWithdraw(address indexed investor, uint256 amount);
    event LogIssuerWithdraw(address indexed issuer, uint256 amount);

    event LogInvestorMakeBid(address indexed investor, string indexed ISIN, uint256 bid);
    event LogInvestorEditBid(address indexed investor, string indexed ISIN, uint256 oldBid, uint256 newBid);
    event LogInvestorCancelBid(address indexed investor, string indexed ISIN, uint256 bid);

    //address private owner;          // dapp owner address
    uint256 private balance;        // balance of the Deal contract wallet
    uint256 private globalFee;              // this is the fee our dapp charges; Assume a flat 5% of total issue size for now
    uint256 private feeRateDecimal;         // use 3 for now
    uint256 private percentageDecimal;     // this is used in percentage calculations

    uint256 public dealCount;       // total number of deals created in the dapp
    mapping( string => DealIssuance ) deals;    // map out ISIN to DealIssuance struct object

    // add an array to store deal ISIN - to enable retrieve keys needed to get the list of deals mapping structure
    // For next release: upgrade this into a double-linked list
    string[] public dealISINList;
    mapping( string => uint256 ) public ISINtoId;    // map out deal ISIN to deal id
    mapping( uint256 => string ) public idToISIN;    // map out deal id to deal ISIN

    uint256 public issuerCount;     // total number of issuers in the dapp
    mapping( address => Issuer ) issuers;     // map out issuer address to Issuer struct object

    uint256 public totalInvestorCount;     // total number of investors in the dApp
    mapping( address => Investor ) investors;     // map out investor address to Investor struct object

    DealTokenFactory public factory;
    DealTokenManager public manager;
    Helpers public helper;

    uint256 public tokenCount;
    mapping(address => address[]) public tracker_0x_addresses;  // map out issuer address to a vector of addresses of DealTokens issued

    // USD Coin tracker address on Ethereum mainnet
    //address public constant USDC = 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48;
    // USD Coin tracker address on Kovan test net
    address public constant USDC = 0xe22da380ee6B445bb8273C81944ADEB6E8450422;

    // Chainlink operator contract deployed on Kovan by Pavel
    address public constant chainlinkOperator = 0x756bC2fb4c9e8794aD4EC1dfb32B52e3AfB3Cd3e;
    // Chainlinnk oracle smart contract deployed on Kovan by Pavel
    address public constant oracleContract = 0x0cfd0c62496a623eD06563422EA03B7b768e5D73;

    IPrimeFiChainLinkClient chainLinkClient;

    // =========================
    /// PLACEHOLDER for Modifiers
    /*
    modifier inState(DealIssuance storage _deal, State _state) {
        require(
            _deal.state == _state,
            "Invalid state."
        );
        _;
    } */

    /**
     * @notice Constructor
     */
    constructor() {
        //owner = msg.sender;
        globalFee = 5000;   // this represents 5% when feeRateDecimal = 3 (for now)
        feeRateDecimal = 3;
        percentageDecimal = 2;
        factory = new DealTokenFactory();
        manager = new DealTokenManager();
        helper = new Helpers();
    }
/*
    receive() payable external {
        balance += msg.value;
    }
*/
    /**
     * @notice Contract Destructor - Mortal design pattern to destroy contract and remove from blockchain
     *
    function kill() public onlyOwner {
        selfdestruct(address(uint160(owner()))); /// cast owner to address payable
    }
*/

    /**
     * @notice Chainlink keepers checkUpkeep function
     */
    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool, bytes memory) {
        string[] memory toBeClosed = new string[](dealCount);
        uint256 count;
        string memory dealISIN;
        DealIssuance storage deal;
        bool upkeepNeeded;

        for (uint256 i = 0; i < dealCount; i++) {
            dealISIN = dealISINList[i];
            deal = deals[dealISIN];
            if (block.timestamp >= deal.offerCloseTime) {
                upkeepNeeded = true;
                toBeClosed[count] = dealISIN;
                count++;
            }
        }
        //uint closeTime = deals[dealISINList[0]].offerCloseTime;
        //string memory toBeClosed;
        //if (block.timestamp >= closeTime) { upkeepNeeded = true; toBeClosed = dealISINList[0]; }
        return (upkeepNeeded, abi.encode(toBeClosed));
    }

    /**
     * @notice Chainlink keepers performUpkeep function
     */
    function performUpkeep(bytes calldata performData) external override {
        string[] memory toBeClosed = abi.decode(performData, (string[]));
        //string memory toBeClosed = abi.decode(performData, (string));
        //closeDealOffering(toBeClosed);
        for (uint256 i = 0; i < toBeClosed.length; i++) {
            closeDealOffering(toBeClosed[i]);
        }
    }

    /**
    * @notice Create issuer & set meta data details
    * @notice chainlink client function is called here to request issuer credit rating
    */
   function createIssuer(string memory _name) public {
        Issuer storage issuer = issuers[msg.sender];
        require(issuer.insert(msg.sender));   // Using my Library IssuerSet here

        issuer.name = _name;
        issuerCount++;
        emit LogCreateIssuer(msg.sender, _name);
        chainLinkClient.requestRating(msg.sender, _name);
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
        _issuer.totalIssuedAmount = helper.safeAdd(_issuer.totalIssuedAmount, deal.finalSize);
        _issuer.totalEscrowFundLockedIn = helper.safeAdd(_issuer.totalEscrowFundLockedIn, deal.totalEscrowAmount);
        _issuer.totalAvailBalance = helper.safeSub(_issuer.totalIssuedAmount, _issuer.totalEscrowFundLockedIn);

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
    * @notice Set Chainlink Client to set up oracle services
    */
    function setChainLinkClient(address _chainLinkClientAddress) external {
        chainLinkClient = IPrimeFiChainLinkClient(_chainLinkClientAddress);
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
        string[] memory dealsBidISIN,
        uint256 totalBalance,
        uint256 totalLockedInBid,
        uint256 availBalance)
    {
        require(msg.sender == _addr, "DEAL:: getAllInvestorDetails: Caller is NOT the investor");
        Investor storage investor = investors[_addr];
        return( investor.dealsBidISIN, investor.totalBalance, investor.totalLockedInBid, investor.availBalance );
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
    } */

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
    * @dev Ignore escrowRatio for now, assuming a fixed 5%
    * @dev Might need to break this into a few separate sub-functions coz stack can become too deep
    */
    function createDealIssuance(
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
        //require(deal.insert(_ISIN));   // Using my Library DealSet here to ensure unique ISIN is used for new deal
        dealISINList.push() = _ISIN;
        // test keepers function by setting this to be 60 seconds after offer start time
        //uint closeTime = block.timestamp + 300 seconds;
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

        // create bi-directional mappings for easier search later on
        deal.id = dealCount;
        ISINtoId[_ISIN] = deal.id;
        idToISIN[deal.id] = _ISIN;

        dealCount++;
        emit LogCreateDealIssuance(msg.sender, _ISIN, _dealName, _initSize, _minSize, _faceValue, _offerPrice, deal.offerStartTime, _offerCloseTime, _term, _interestRate, _interestPaymentDates, _upfrontFee);
        //emit LogCreateDealIssuance(msg.sender, _ISIN, _dealName, _initSize, _minSize, _faceValue, _offerPrice, deal.offerStartTime, deal.offerCloseTime, _term, _interestRate, _interestPaymentDates, _upfrontFee);
    }

    /**
    * @notice Step 1 - Close deal offering (book-building) process after dealCloseTime is crossed
    *         Step 2 - Decide whether to launch the official issuance period, or cancel;
    *         Step 3 - Mint DealToken for the issuance, calculate investor allocation then allocate accordingly;
    *         Step 4 - Transfer investor fund to escrow account & the rest to issuer wallet;
    *         Step 5 - Transfer deal token from Deal contract to each investor account
    *         Step 6 - Update all relevant details for the issuance, the issuer, and the investors
    * @dev Successfully integrated with Chainlink keepers :)
    */
    function closeDealOffering(string memory _ISIN) internal returns(bool) {
        //require(msg.sender == deals[_ISIN].issuer, "DEAL:: closeDealOffering: Caller is NOT the issuer");
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
            uint256 ratioInDecimal = helper.safeDiv( helper.safeMul( finalSize, 10**feeRateDecimal ), deal.totalInvestorBid );
            uint256 finalAllocation;

            for(uint i=0; i<deal.investors.length; i++) {
                address investorAddr = deal.investors[i];

                // must adjust investor allocation when deal is overbid; no need otherwise
                if(deal.totalInvestorBid > finalSize) {
                    // convert back to normal number without decimals
                    finalAllocation = helper.safeDiv( helper.safeMul( ratioInDecimal, investors[investorAddr].lockedInBid[_ISIN] ), 10**feeRateDecimal );

                    // convert escrowRatio to num w/o decimals, then convert to percentage value before safeMul with finalAllocation
                    deal.totalEscrowAmount = helper.safeAdd( deal.totalEscrowAmount, helper.safeDiv( helper.safeMul( helper.safeDiv( deal.escrowRatio, 10**feeRateDecimal ), finalAllocation ), 10**percentageDecimal ) );

                    investors[investorAddr].lockedInBid[_ISIN] = finalAllocation;
                    // finalSize is capped at initSize; so must adjust allocated investment amount for each investor
                    adjustInvestorAllocation(_ISIN, finalAllocation, investorAddr);
                }
                // deal token & investment stablecoin transfer
                transferStableCoin(_ISIN, investorAddr, finalAllocation);
                transferStableCoin(investorAddr, finalAllocation);
                transferDealToken(_ISIN, investorAddr, finalAllocation);
                editInvestorDetailsPostNewIssuance(_ISIN, investors[investorAddr]);
            }
            deal.totalInvestorBid = helper.safeDiv( helper.safeMul( ratioInDecimal, deal.totalInvestorBid ), 10**feeRateDecimal );
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
        investor.totalBalance = helper.safeSub(investor.totalBalance, _finalAllocation);
        investor.totalLockedInBid = helper.safeSub(investor.totalLockedInBid, investor.lockedInBid[_ISIN]);
        investor.availBalance = helper.safeSub(investor.totalBalance, investor.totalLockedInBid);
    }

     /**
    * @notice Transfer stablecoin funding from investors to issuer
    */
    //function transferStableCoin(string memory _ISIN, address _investorAddr, uint256 _allocation) internal {
    function transferStableCoin(address _investorAddr, uint256 _allocation) internal {
        // transfer investor fund to dapp wallet, and assuming
        //   the owner of stablecoin tracker account has approved & given alllowance to investor wallet
        ERC20(USDC).transferFrom(_investorAddr, address(this), _allocation);
        emit LogTransferStableCoin(_investorAddr, _allocation);
    }

    /**
    * @notice Transfer allocated deal tokens to investors
    */
    function transferDealToken(string memory _ISIN, address _investorAddr, uint256 _allocation) internal {
        DealIssuance storage deal = deals[_ISIN];
        address tokenAddr = deal.token.tokenAddr;
        uint256 tokenAmount = helper.safeDiv(_allocation, deal.faceValue);

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
    */
    function mintToken(string memory _ISIN, address _issuerAddr) internal {
        require(msg.sender == _issuerAddr, "DEAL:: mintToken: Caller is NOT the issuer");

        DealIssuance storage deal = deals[_ISIN];
        string memory _name = deal.token.name;
        string memory _symbol = deal.token.symbol;
        uint256 _totalSupply = helper.safeDiv(deal.finalSize, deal.faceValue);
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
    */
    function investorMakeDeposit(uint256 _amount) public {
        ERC20(USDC).transfer(address(this), _amount);
        Investor storage investor = investors[msg.sender];

        investor.totalBalance = helper.safeAdd( investor.totalBalance, _amount );
        investor.availBalance = helper.safeAdd( investor.availBalance, _amount );

        // Call library InvestorSet to see if investor already exists
        if(investor.insert(msg.sender)) {
            totalInvestorCount++;
        }
        emit LogInvestorMakeDeposit(msg.sender, _amount);
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

        deal.totalInvestorBid = helper.safeAdd(deal.totalInvestorBid, _bidAmount);

        investor.dealsBidId[investor.dealsBidCount] = ISINtoId[_ISIN];
        investor.dealsBidISIN[investor.dealsBidCount] = _ISIN;
        investor.dealsBidCount++;

        investor.totalLockedInBid = helper.safeAdd(investor.totalLockedInBid, _bidAmount);
        investor.availBalance = helper.safeSub(investor.totalBalance, investor.totalLockedInBid);
        investor.lockedInBid[_ISIN] = _bidAmount;

        deal.investors.push() = msg.sender;
        deal.investorCount++;
        deal.investorAlreadyBid[msg.sender] = true;

        emit LogInvestorMakeBid(msg.sender, _ISIN, _bidAmount);
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
    function investorEditBid(string memory _ISIN, uint256 _newBidAmount) public {
        DealIssuance storage deal = deals[_ISIN];
        Investor storage investor = investors[msg.sender];

        //require(msg.sender == deal.investors[], "DEAL:: investorEditBid: Not an investor for this deal");    // need to verify if msg.sender is an investor for this deal
        require(deal.isOfferLive, "DEAL:: investorEditBid: You cannot change a bid if the offer is NOT live");
        require(deal.investorAlreadyBid[msg.sender], "DEAL:: investorEditBid: you haven't made a bid yet");
        require(_newBidAmount <= investor.totalBalance, "DEAL:: investorEditBid: insuffient fund");

        uint256 oldBid = investor.lockedInBid[_ISIN];

        deal.totalInvestorBid = helper.safeAdd( helper.safeSub( deal.totalInvestorBid, oldBid ), _newBidAmount );

        investor.totalLockedInBid = helper.safeAdd( helper.safeSub( investor.totalLockedInBid, oldBid ), _newBidAmount );
        investor.availBalance = helper.safeSub( investor.totalBalance, investor.totalLockedInBid );

        investor.lockedInBid[_ISIN] = _newBidAmount;

        emit LogInvestorEditBid(msg.sender, _ISIN, oldBid, _newBidAmount);
    }

    /**
    * @notice Investor cancels a bid s/he made earlier
    * @dev this is only allowed when the deal's offer period is live & when there's an existing bid made by the investor
    */
    function investorCancelBid(string memory _ISIN) public {
        DealIssuance storage deal = deals[_ISIN];
        Investor storage investor = investors[msg.sender];

        require(deals[_ISIN].isOfferLive, "DEAL:: investorCancelBid: Cannot cancel - the offer is NOT live");
        require(deal.investorAlreadyBid[msg.sender], "DEAL:: investorCancelBid: Cannot cancel - you haven't made a bid yet");

        uint256 bid = investor.lockedInBid[_ISIN];
        deal.totalInvestorBid = helper.safeSub(deal.totalInvestorBid, bid);

        for (uint i = 0; i < investor.dealsBidCount; i++) {
            if (investor.dealsBidId[i] == ISINtoId[_ISIN]) {
                delete investor.dealsBidId[i];
                delete investor.dealsBidISIN[i];
            }
        }
        investor.dealsBidCount--;

        investor.totalLockedInBid = helper.safeSub(investor.totalLockedInBid, bid);
        investor.availBalance = helper.safeAdd(investor.availBalance, bid);
        investor.lockedInBid[_ISIN] = 0;

        for (uint j = 0; j < deal.investorCount; j++) {
            if (deal.investors[j] == msg.sender) {
                delete deal.investors[j];
            }
        }
        deal.investorCount--;
        deal.investorAlreadyBid[msg.sender] = false;

        emit LogInvestorCancelBid(msg.sender, _ISIN, bid);
    }


    function investorWithdraw(address _addr, uint256 _amount) public {
    }

    /***
    function issuerWithdraw(address payable _issuerExternalAddr, string memory _ISIN, uint256 _amount) public {
        require(msg.sender == deals[_ISIN].issuer, "DEAL:: issuerWithdrawFund: Caller is NOT the issuer");
        require(_amount <= issuers[msg.sender][_ISIN].availableBalance, "DEAL:: issuerWithdrawFund: Not enough available fund");

        issuers[msg.sender][_ISIN].availableBalance -= _amount;
        _issuerExternalAddr.transfer(_amount);
    } */

/**
    function issuerTopUpEscrow(string memory _ISIN) public {}
    function payInterimCoupon()
    function redeemAtMaturity()
    function handleDefaultEvent()
*/
}
