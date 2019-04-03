const log = global.log
const SERVICE_NAME = 'local-storage-service'
var localStorage = null

function init() {
    log.info(`${SERVICE_NAME}::init:`)

    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').JSONStorage
        localStorage = new LocalStorage('./local-storage')
      }
}

function setItem(namespace, key, value) {
    log.info(`${SERVICE_NAME}::setItem:namespace:${namespace}, key:${key}, value:${value}`)
    localStorage.setItem(`${namespace}_${key}`, value)
}

function getItem(namespace, key) {
    log.info(`${SERVICE_NAME}::getItem:key:${namespace}, ${key}`)
    return localStorage.getItem(`${namespace}_${key}`)
}

module.exports.init = init
module.exports.setItem = setItem
module.exports.getItem = getItem