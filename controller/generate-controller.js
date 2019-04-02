const createActionProcessor = require('../action-processor/create-action')
const roleActionProcessor = require('../action-processor/assign-role-action')
const actions = require('../common/constants')
const fs = require('fs-extra')
const storage = require('node-persist')
const organisationService = require('../service/organisation-service')
const userService = require('../service/user-service')
const log = global.log
const CONTROLLER_NAME = 'generate-controller'

async function generate(filename, storageDir) {
    log.info('Generating ...')
    await setupLocalStorage(storageDir)
    let rawdata = fs.readFileSync(filename)
    let jsonData = JSON.parse(rawdata)
    await processActions(jsonData)
}

async function tearDown(storageDir) {
    log.info('Tearing down ...')
    await tearDownEntities(storageDir)
    await tearDownLocalStorage(storageDir)
}

async function processActions(actionJson) {
    let actionRecords = actionJson.actions

    for (const action of actionRecords) {
        // Save a copy of each action for later reference
        await storage.setItem(action.label, action)

        switch (action.action) {
            case actions.ACTION_CREATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await createActionProcessor.process(action)
                break
            case actions.ACTION_UPDATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                break
            case actions.ACTION_ASSIGN_ROLE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await roleActionProcessor.process(action)
                break
            default:
                log.debug(`${CONTROLLER_NAME}::unrecognised action ${action.action}`)
                break
        }
    }
    console.log(await storage.keys())
}

async function setupLocalStorage(storageDir) {
    log.info(`${CONTROLLER_NAME}::setupLocalStorage:${storageDir}`)
    await storage.init({
        dir: `local-storage/${storageDir}`,
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,  // can also be custom logging function
        ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
        expiredInterval: 20 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
        // in some cases, you (or some other service) might add non-valid storage files to your
        // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
        forgiveParseErrors: false
    })
}

async function tearDownEntities(storageDir) {
    await tearDownVetPractice()
    await tearDownVet()
}

async function tearDownLocalStorage(storageDir) {
    await storage.clear()
    fs.removeSync(`./local-storage/${storageDir}`)
}

async function tearDownVetPractice() {
    const vetPracticeIdList = await storage.getItem('vetPracticeIdList')
    if (vetPracticeIdList) {
        for (id of vetPracticeIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet practice with id ${id}`)
            await organisationService.deleteOrganisation(id)
        }
    }
}

async function tearDownVet() {
    const vetIdList = await storage.getItem('vetIdList')
    if (vetIdList) {
        for (id of vetIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet with id ${id}`)
            await userService.deleteUser(id)
        }
    }
}

module.exports.generate = generate
module.exports.tearDown = tearDown