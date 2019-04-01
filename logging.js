function setupLogging (service, config) {
  var logDir = config.isDev || config.isLocal ? 'logs' : '/var/log/vmd'
  var logLevel = config.isDev || config.isLocal ? 'debug' : 'warn'
  var fs = require('fs')

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
  }
  const logOpts = {
    level: logLevel,
    logDirectory: logDir,
    fileNamePattern: service + '-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
  }
  const log = require('simple-node-logger').createRollingFileLogger(logOpts)
  return log
}

module.exports.setupLogging = setupLogging
