const Deal = artifacts.require("Deal");

module.exports = function (deployer) {
  deployer.deploy(Deal);
};
