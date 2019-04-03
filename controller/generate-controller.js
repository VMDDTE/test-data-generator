const createActionProcessor = require('../action-processor/create-action')
const roleActionProcessor = require('../action-processor/assign-role-action')
const actions = require('../common/constants')
const fs = require('fs-extra')
const localStorage = require('../service/local-storage-service')
const organisationService = require('../service/organisation-service')
const userService = require('../service/user-service')
const log = global.log
const CONTROLLER_NAME = 'generate-controller'

async function generate(filename, namespace) {
    log.info(`Generating ... ${namespace}`)
    localStorage.init()
    let rawdata = fs.readFileSync(filename)
    let jsonData = JSON.parse(rawdata)
    await processActions(namespace, jsonData)
}

async function tearDown(namespace) {
    log.info(`Tearing down ... ${namespace}`)
    await tearDownEntities(namespace)
    await tearDownLocalStorage(namespace)
}

async function processActions(namespace, actionJson) {
    let actionRecords = actionJson.actions

    for (const action of actionRecords) {
        // Save a copy of each action for later reference
        localStorage.setItem(namespace, action.label, action)

        switch (action.action) {
            case actions.ACTION_CREATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await createActionProcessor.process(namespace, action)
                break
            case actions.ACTION_UPDATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                break
            case actions.ACTION_ASSIGN_ROLE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await roleActionProcessor.process(namespace, action)
                break
            default:
                log.debug(`${CONTROLLER_NAME}::unrecognised action ${action.action}`)
                break
        }
    }
    //console.log(await storage.keys())
}

async function tearDownEntities(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownEntities:${namespace}`)
    await tearDownVetPractice(namespace)
    await tearDownVet(namespace)
}

async function tearDownLocalStorage(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownLocalStorage:${namespace}`)
    localStorage.clear(namespace)
}

async function tearDownVetPractice(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownVetPractice:${namespace}`)
    const vetPracticeIdList = localStorage.getItem(namespace, 'vetPracticeIdList')
    if (vetPracticeIdList) {
        for (id of vetPracticeIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet practice with id ${id}`)
            await organisationService.deleteOrganisation(id)
        }
    }
}

async function tearDownVet(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownVet:${namespace}`)
    const vetIdList = localStorage.getItem(namespace, 'vetIdList')
    if (vetIdList) {
        for (id of vetIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet with id ${id}`)
            await userService.deleteUser(id)
        }
    }
}

module.exports.generate = generate
module.exports.tearDown = tearDown