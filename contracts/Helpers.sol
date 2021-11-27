// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Helpers {

    function safeAdd(uint256 _a, uint256 _b) external pure returns(uint256) {
        return SafeMath.add(_a, _b);
    }

    function safeSub(uint256 _a, uint256 _b) external pure returns(uint256) {
        return SafeMath.sub(_a, _b);
    }

    function safeMul(uint256 _a, uint256 _b) external pure returns(uint256) {
        return SafeMath.mul(_a, _b);
    }

    function safeDiv(uint256 _a, uint256 _b) external pure returns(uint256) {
        return SafeMath.div(_a, _b);
    }
}
