// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

/// This represents an unique investor
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

library InvestorSet {
    function insert(Investor storage _self, address _addr) public returns (bool) {
        if (_self.isExisting[_addr])
            return false; // already there
        _self.isExisting[_addr] = true;
        return true;
    }

    function remove(Investor storage _self, address _addr) public returns (bool) {
        if (!_self.isExisting[_addr])
            return false; // not there
        _self.isExisting[_addr] = false;
        return true;
    }

    function contains(Investor storage _self, address _addr) public view returns (bool) {
        return _self.isExisting[_addr];
    }
}
