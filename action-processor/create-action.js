const storage = require('node-persist')
const actionTypes = require('../common/constants')
const orgTypes = require('../common/constants')
const userTypes = require('../common/constants')
const organisationService = require('../service/organisation-service')
const userService = require('../service/user-service')
const log = global.log

const SERVICE_NAME = 'create-action-processor'

async function process(action) {
    log.debug(`${SERVICE_NAME}::process`)
    switch (action.type) {
        case actionTypes.TYPE_VET:
            log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_VET}`)
            await createVet(action)
            break
        case actionTypes.TYPE_VET_PRACTICE_RECORD:
            log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_VET_PRACTICE_RECORD}`)
            await createVetPractice(action)
            break
        default:
            log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
            break
    }
}

async function createVetPractice(action) {
    log.debug(`${SERVICE_NAME}::createVetPractice`)
    let vetPracticeData = action.data
    log.info(`${SERVICE_NAME}::createVetPractice::${action.label}::creating vet practice from ${JSON.stringify(vetPracticeData)}`)
    let response = await organisationService.createOrganisation(orgTypes.ORG_TYPE_VET_PRACTICE, vetPracticeData)
    let responseData = response.data
    log.info(`${SERVICE_NAME}::createVetPractice::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = await storage.getItem(action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createVetPractice, saved action ${JSON.stringify(savedAction)}`)
    await storage.setItem(action.label, savedAction)
    var vetPracticeIdList = await storage.getItem('vetPracticeIdList')
    if (!vetPracticeIdList) {
        vetPracticeIdList = []
    }
    vetPracticeIdList.push(responseData.id)
}

async function createVet(action) {
    log.debug(`${SERVICE_NAME}::createVet`)
    let vetData = action.data
    log.info(`${SERVICE_NAME}::createVet::${action.label}::creating vet from ${JSON.stringify(vetData)}`)
    let response = await userService.createUser(userTypes.USER_TYPE_VET, vetData)
    let responseData = response.data
    log.info(`${SERVICE_NAME}::createVet::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = await storage.getItem(action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createVet, saved action ${JSON.stringify(savedAction)}`)
    await storage.setItem(action.label, savedAction)
    var vetIdList = await storage.getItem('vetIdList')
    if (!vetIdList) {
        vetIdList = []
    }
    vetIdList.push(responseData.Id)
}

module.exports.process = process
