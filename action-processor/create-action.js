const actionTypes = require('../common/constants')
const orgTypes = require('../common/constants')
const userTypes = require('../common/constants')
const organisationService = require('../service/organisation-service')
const localStorage = require('../service/local-storage-service')
const userService = require('../service/user-service')
const log = global.log

const SERVICE_NAME = 'create-action-processor'

async function process(namespace, action) {
    log.debug(`${SERVICE_NAME}::${namespace}::process`)
    switch (action.type) {
        case actionTypes.TYPE_VET:
            log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_VET}`)
            await createVet(namespace, action)
            break
        case actionTypes.TYPE_VET_PRACTICE_RECORD:
            log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_VET_PRACTICE_RECORD}`)
            await createVetPractice(namespace, action)
            break
        default:
            log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
            break
    }
}

async function createVetPractice(namespace, action) {
    log.debug(`${SERVICE_NAME}::createVetPractice`)
    let vetPracticeData = action.data
    log.info(`${SERVICE_NAME}::createVetPractice::${action.label}::creating vet practice from ${JSON.stringify(vetPracticeData)}`)
    let response = await organisationService.createOrganisation(orgTypes.ORG_TYPE_VET_PRACTICE, vetPracticeData)
    let responseData = response.data
    log.info(`${SERVICE_NAME}::createVetPractice::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(namespace, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createVetPractice, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(namespace, action.label, savedAction)
    var vetPracticeIdList = localStorage.getItem(namespace, 'vetPracticeIdList')
    if (!vetPracticeIdList) {
        vetPracticeIdList = []
    }
    vetPracticeIdList.push(responseData.id)
    localStorage.setItem(namespace, 'vetPracticeIdList', vetPracticeIdList)
}

async function createVet(namespace, action) {
    log.debug(`${SERVICE_NAME}::createVet`)
    let vetData = action.data
    log.info(`${SERVICE_NAME}::createVet::${action.label}::creating vet from ${JSON.stringify(vetData)}`)
    let response = await userService.createUser(userTypes.USER_TYPE_VET, vetData)
    let responseData = response.data
    log.info(`${SERVICE_NAME}::createVet::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(namespace, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createVet, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(namespace, action.label, savedAction)
    var vetIdList = localStorage.getItem(namespace, 'vetIdList')
    if (!vetIdList) {
        vetIdList = []
    }
    vetIdList.push(responseData.Id)
    localStorage.setItem(namespace, 'vetIdList', vetIdList)
}

module.exports.process = process
