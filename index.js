const config = require('./config')
global.log = require('./logging').setupLogging('data-generator', config)
const generator = require('./controller/generate-controller')

async function generate(featureName) {
    const dataFileName = `${featureName}.json`
    console.log(`Running data generator using input [${dataFileName}]`)
    await generator.generate(`./test-data/${dataFileName}`, featureName)
}

async function tearDown(featureName) {
    console.log(`Tearing down [${featureName}] ...`)
    await generator.tearDown(featureName)
}

module.exports.generate = generate
module.exports.tearDown = tearDown