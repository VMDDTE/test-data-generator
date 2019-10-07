const config = require('./config')
global.log = require('./logging').setupLogging('data-generator', config)
const generator = require('./controller/generate-controller')
const localStorage = require('./service/local-storage-service')

async function generate (filename, namespace) {
    const dataFileName = `${filename}.json`
    var featureName = filename
    if (namespace) {
        featureName = `${filename}-${namespace}`
    }
    console.log(`Running data generator using input [${dataFileName}] and featureName [${featureName}]`)
    await generator.generate(`./test-data/${dataFileName}`, featureName, namespace)
}

async function tearDown (filename, namespace) {
    var featureName = filename
    if (namespace) {
        featureName = `${filename}-${namespace}`
    }
    console.log(`Tearing down [${featureName}] ...`)
    await generator.tearDown(featureName)
}

async function clearAll () {
    console.log(`clear all ...`)
    localStorage.clearAll()
}

async function tearDownGlobal () {
    await generator.tearDownGlobal()
}

async function getTestUser (filename, namespace) {
    var featureName = filename
    if (namespace) {
        featureName = `${filename}-${namespace}`
    }
    const testuser = localStorage.getItem(featureName, 'testuser')
    if (testuser) {
        console.log(`Running with Test User [${testuser.Email}] ...`)
        return testuser
    }

    // Check for a global test user
    let globalTestUser = localStorage.getItem('global', 'testuser')
    if (globalTestUser) {
        console.log(`Running with GLOBAL Test User [${globalTestUser.Email}] ...`)
        return globalTestUser
    }
    return null
}

async function getInvites (filename, namespace) {
    var featureName = filename
    if (namespace) {
        featureName = `${filename}-${namespace}`
    }
    const invites = localStorage.getItem(featureName, 'invitations')
    if (invites) {
        console.log(`Invitations send with id [${invites.join(', ')}] ...`)
        return invites
    }
    return null
}


module.exports.generate = generate
module.exports.tearDown = tearDown
module.exports.clearAll = clearAll
module.exports.getInvites = getInvites
module.exports.getTestUser = getTestUser
module.exports.tearDownGlobal = tearDownGlobal
