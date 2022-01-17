const apn = require('apn')
let apnProviderInstance

module.exports = () => {
  const apnOptions = {
    token: global.APP_CONFIG.apnToken,
    production: true
  }
  apnProviderInstance = new apn.Provider(apnOptions)
}

module.exports.getApnProvider = () => apnProviderInstance
