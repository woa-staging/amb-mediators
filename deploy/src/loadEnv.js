const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '..', '.env')
})
const { isAddress, toBN } = require('web3').utils
const envalid = require('envalid')

const bigNumValidator = envalid.makeValidator(x => toBN(x))
const validateAddress = address => {
  if (isAddress(address)) {
    return address
  }

  throw new Error(`Invalid address: ${address}`)
}
const addressValidator = envalid.makeValidator(validateAddress)

const { BRIDGE_MODE } = process.env

let validations = {
  DEPLOYMENT_ACCOUNT_PRIVATE_KEY: envalid.str(),
  DEPLOYMENT_GAS_LIMIT_EXTRA: envalid.num(),
  HOME_DEPLOYMENT_GAS_PRICE: bigNumValidator(),
  FOREIGN_DEPLOYMENT_GAS_PRICE: bigNumValidator(),
  GET_RECEIPT_INTERVAL_IN_MILLISECONDS: bigNumValidator(),
  HOME_RPC_URL: envalid.str(),
  HOME_BRIDGE_OWNER: addressValidator(),
  HOME_UPGRADEABLE_ADMIN: addressValidator(),
  FOREIGN_RPC_URL: envalid.str(),
  FOREIGN_BRIDGE_OWNER: addressValidator(),
  FOREIGN_UPGRADEABLE_ADMIN: addressValidator(),
  HOME_AMB_BRIDGE: addressValidator(),
  FOREIGN_AMB_BRIDGE: addressValidator()
}

switch (BRIDGE_MODE) {
  case 'AMB_ENS_MIRRORING':
    validations = {
      ...validations,
      FOREIGN_MEDIATOR_REQUEST_GAS_LIMIT: bigNumValidator(),
      FOREIGN_ENS_REGISTRY_ADDRESS: addressValidator()
    }
    break
  default:
    throw new Error('Invalid BRIDGE_MODE. Please specify on of [AMB_ENS_MIRRORING]')
}

module.exports = envalid.cleanEnv(process.env, validations)
