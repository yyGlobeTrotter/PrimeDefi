// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

/// This represents different state during issuing process; Certain actions are only allowed within certain state
enum State {
    INACTIVE,       // before deal issuance creation, default state
    OFFERLIVE,      // offer period has started but not closed
    OFFERCLOSED,    // offer period has closed out but investment/tokens not allocated yet
    ISSUED,         // investment/tokens have been allocated and official issuance started
    CANCELLED,      // deal issuance has been cancelled due to insuffient fund raised, or other reasons
    REDEEMED        // the end of deal lifecycle - maturity or early redemption; principle investment and any last coupons are paid out, all o/s deal tokens are destroyed
}

/// This represents an unique DealToken
struct Token {
    address tokenAddr;
    address issuer;
    string name;
    string symbol;      // use issuance ISIN as token symbol
    uint256 totalSupply;    // finalSize divided by facevalue
}

/// This represents an unique issuance
struct DealIssuance {
    uint256 id;     // difficult to handle string in solidity, better to add a numeric identifier!!!
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

library DealSet {
    function insert(DealIssuance storage _self, string memory _ISIN) public returns (bool) {
        if (_self.isExistingISIN[_ISIN])
            return false; // already there
        _self.isExistingISIN[_ISIN] = true;
        return true;
    }

    function remove(DealIssuance storage _self, string memory _ISIN) public returns (bool) {
        if (!_self.isExistingISIN[_ISIN])
            return false; // not there
        _self.isExistingISIN[_ISIN] = false;
        return true;
    }

    function contains(DealIssuance storage _self, string memory _ISIN) public view returns (bool) {
        return _self.isExistingISIN[_ISIN];
    }
}
