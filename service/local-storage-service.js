const log = global.log

const SERVICE_NAME = 'local-storage-service'
var localStorage = null

function init(storageDir) {
    log.info(`${SERVICE_NAME}::init:${storageDir}`)

    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage
        localStorage = new LocalStorage(`./${storageDir}`)
      }
}

function setItem(key, value) {
    log.info(`${SERVICE_NAME}::setItem:key:${key}, value:${value}`)
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage
        localStorage = new LocalStorage(`./${storageDir}`)
      }
      
      localStorage.setItem(key, JSON.stringify(value))
}

function getItem(key) {
    log.info(`${SERVICE_NAME}::getItem:key:${key}`)
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage
        localStorage = new LocalStorage(`./${storageDir}`)
      }
      
      return localStorage.getItem(key)
}

module.exports.init = init
module.exports.setItem = setItem
module.exports.getItem = getItem