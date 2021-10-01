const Token = artifacts.require("Token");
const Bank = artifacts.require("Bank");

module.exports = async (deployer) => {
  await deployer.deploy(Token);
  const token = await Token.deployed();

  await deployer.deploy(Bank, token.address);
  const bank = await Bank.deployed();
  await token.changeAdmin(bank.address);
  // pass admin to bank
};
