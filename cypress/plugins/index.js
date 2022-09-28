const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`)
  if(!fs.existsSync(pathToConfigFile)){
    return {};
  }

  return fs.readJson(pathToConfigFile)
}



module.exports = (on, config) => {
    // accept a configFile value or use development by default
    // https://docs.cypress.io/api/plugins/configuration-api#Switch-between-multiple-configuration-files
  const file = config.env.configFile 

  return getConfigurationByFile(file)
  }