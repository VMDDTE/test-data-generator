const config = require('./config')
global.log = require('./logging').setupLogging('data-generator', config)
const generator = require('./controller/generate-controller')
const localStorage = require('./service/local-storage-service')

async function generate (filename, namespace) {
    const dataFileName = `${filename}.json`
    const featureName = getFeatureName (filename, namespace)
    console.log(`Running data generator using input [${dataFileName}] and featureName [${featureName}]`)
    await generator.generate(`./test-data/${dataFileName}`, featureName, namespace)
}

async function getTestUser (filename, namespace) {
    const featureName = getFeatureName (filename, namespace)
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

async function getExternalUsers (filename, namespace) {
    const featureName = getFeatureName (filename, namespace)
    const externalUsers = localStorage.getItem(featureName, 'externalUsers')

    if (externalUsers) {
        console.log(`External users found ...`)
        return externalUsers
    }
    return null
}

async function getInvites (filename, namespace) {
    const featureName = getFeatureName (filename, namespace)
    const invites = localStorage.getItem(featureName, 'invitations')
    if (invites) {
        console.log(`Invitations send with id [${invites.join(', ')}] ...`)
        return invites
    }
    return null
}

async function clearAll () {
    console.log(`clear all ...`)
    localStorage.clearAll()
}

async function tearDown (filename, namespace) {
    const featureName = getFeatureName (filename, namespace)
    console.log(`Tearing down [${featureName}] ...`)
    await generator.tearDown(featureName)
}

async function tearDownGlobal () {
    await generator.tearDownGlobal()
}

module.exports ={
    generate,
    
    getTestUser,
    getExternalUsers,
    getInvites,

    clearAll,

    tearDown,
    tearDownGlobal
} 

// Private method

function getFeatureName (filename, namespace) {
    var featureName = filename
    if (namespace) {
        featureName = `${filename}-${namespace}`
    }
    return featureName
}