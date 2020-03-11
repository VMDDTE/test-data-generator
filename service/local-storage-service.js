const log = global.log
const SERVICE_NAME = 'local-storage-service'
const fs = require('fs')
const path = require('path')
const dirNames = require('../common/constants')
const localStorageDir = `./${dirNames.LOCAL_STORAGE_NAME}`
var localStorage = null

function init () {
    log.info(`${SERVICE_NAME}::init:`)

    if (typeof localStorage === 'undefined' || localStorage === null) {
        var LocalStorage = require('node-localstorage').JSONStorage
        localStorage = new LocalStorage(localStorageDir)
    }
}

function setItem (namespace, key, value) {
    log.info(`${SERVICE_NAME}::setItem:namespace:${namespace}, key:${key}, value:${value}`)
    localStorage.setItem(`${namespace}_${key}`, value)
}

function getItem (namespace, key) {
    log.info(`${SERVICE_NAME}::getItem:key:${namespace}, ${key}`)
    return localStorage.getItem(`${namespace}_${key}`)
}

function clear (namespace) {
    const keys = JSON.parse(JSON.stringify(localStorage._keys))
    for (let key of keys) {
        log.info(`${SERVICE_NAME}::clear:key:${namespace}, ${key}`)
        if (key.startsWith(namespace)) {
            log.info(`${SERVICE_NAME}::clearing:key:${namespace}, ${key}`)
            localStorage.removeItem(key)
        }
    }
}

function clearAll () {
    log.info(`${SERVICE_NAME}::clearAll`)
    fs.readdir(localStorageDir, (err, files) => {
        if (!err) {
            for (const file of files) {
                log.info(`deleting file ${file}`)
                fs.unlink(path.join(localStorageDir, file), err => {
                    if (err) throw err
                })
            }
        }
    })
}

function getItemOrGlobal (namespace, key) {
    let savedAction = localStorage.getItem(`${namespace}_${key}`)
    if(savedAction && savedAction.response) {
        return savedAction.response
    } 
    
   savedAction = localStorage.getItem(`global_${key}`)     // Check the global namespace
    if(savedAction && savedAction.response){
        return savedAction.response
    }

    log.info(`${SERVICE_NAME}::getItemOrGlobal:${namespace}, ${key}:${JSON.stringify(savedAction)}`)
    throw (`label: ${key} is not found. Check if it is created in your data files`)
}

module.exports.init = init
module.exports.setItem = setItem
module.exports.getItem = getItem
module.exports.clear = clear
module.exports.clearAll = clearAll
module.exports.getItemOrGlobal = getItemOrGlobal
