const config = require('./config')
global.log = require('./logging').setupLogging('data-generator', config)
const generator = require('./controller/generate-controller')
const localStorage = require('./service/local-storage-service')

async function generate(featureName) {
    const dataFileName = `${featureName}.json`
    console.log(`Running data generator using input [${dataFileName}]`)
    await generator.generate(`./test-data/${dataFileName}`, featureName)
}

async function tearDown(featureName) {
    console.log(`Tearing down [${featureName}] ...`)
    await generator.tearDown(featureName)
}

async function clearAll() {
    console.log(`clear all ...`)
    localStorage.clearAll()
}

module.exports.generate = generate
module.exports.tearDown = tearDown
module.exports.onComplete = onComplete
module.exports.clearAll = clearAll