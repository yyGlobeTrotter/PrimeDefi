// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "./Deal.sol";

interface IPrimeFiChainLinkClient {
  function requestRating(address _issuerAddress, string memory _issuerName) external;
}

contract PrimeFiChainLinkClient is ChainlinkClient, ConfirmedOwner, IPrimeFiChainLinkClient {
  using Chainlink for Chainlink.Request;

  uint256 constant private ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;
  uint256 public currentPrice;
  int256 public changeDay;
  bytes32 public lastMarket;

  address public oracle = 0x0cfd0c62496a623eD06563422EA03B7b768e5D73;
  string public chainlinkNodeJobId = "db4bf74b01d6462f9151607832ba84f5";

  mapping (bytes32 => address) requestIdToIssuer;
  mapping (bytes32 => address) requestIdToSender;

  constructor() ConfirmedOwner(msg.sender){
    setPublicChainlinkToken();
  }

  function setOracle(address _newOracle) public onlyOwner {
    oracle = _newOracle;
  }

   function setChainlinkNode(string memory _newChainlinkNodeJobId) public onlyOwner {
    chainlinkNodeJobId = _newChainlinkNodeJobId;
  }

  function requestRating(address _issuerAddress, string memory _issuerName) override external
    {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(chainlinkNodeJobId), address(this), this.fulfillRating.selector);
        req.add("name", _issuerName);
        sendChainlinkRequestTo(oracle, req, ORACLE_PAYMENT);
        requestIdToIssuer[req.id] = _issuerAddress;
        requestIdToSender[req.id] = msg.sender;
    }


  function fulfillRating(bytes32 _requestId, bytes32 _rating)
    public
    recordChainlinkFulfillment(_requestId)
  {
    address issuer = requestIdToIssuer[_requestId];
    address sender = requestIdToSender[_requestId];
    IDeal deal = IDeal(sender);
    deal.setIssuerRating(issuer, string(abi.encodePacked(_rating)));
  }

  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
    onlyOwner
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }
}