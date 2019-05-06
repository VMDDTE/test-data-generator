const config = require('./config')
global.log = require('./logging').setupLogging('data-generator', config)
const generator = require('./controller/generate-controller')
const localStorage = require('./service/local-storage-service')

async function generate(filename, namespace) {
    const dataFileName = `${filename}.json`
    var featureName = filename
    if (namespace) {
        featureName = `${filename}-${namespace}`
    }
    console.log(`Running data generator using input [${dataFileName}] and featureName [${featureName}]`)
    await generator.generate(`./test-data/${dataFileName}`, featureName)
}

async function tearDown(filename, namespace) {
    var featureName = filename
    if (namespace) {
        featureName = `${filename}-${namespace}`
    }
    console.log(`Tearing down [${featureName}] ...`)
    await generator.tearDown(featureName)
}

async function clearAll() {
    console.log(`clear all ...`)
    localStorage.clearAll()
}

module.exports.generate = generate
module.exports.tearDown = tearDown
module.exports.clearAll = clearAll