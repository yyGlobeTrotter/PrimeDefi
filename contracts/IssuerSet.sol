// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

/// This represents an unique issuer
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

library IssuerSet {
    function insert(Issuer storage _self, address _addr) public returns (bool) {
        if (_self.isExisting[_addr])
            return false; // already there
        _self.isExisting[_addr] = true;
        return true;
    }

    function remove(Issuer storage _self, address _addr) public returns (bool) {
        if (!_self.isExisting[_addr])
            return false; // not there
        _self.isExisting[_addr] = false;
        return true;
    }

    function contains(Issuer storage _self, address _addr) public view returns (bool) {
        return _self.isExisting[_addr];
    }
}
