const actionTypes = require('../common/constants')
const orgTypes = require('../common/constants')
const organisationService = require('../service/organisation-service')
const localStorage = require('../service/local-storage-service')
const log = global.log

const SERVICE_NAME = 'delete-action-processor'

async function process (featureName, action) {
    log.debug(`${SERVICE_NAME}::${featureName}::process`)
    switch (action.type) {
    case actionTypes.ACTION_TYPE_MANUFACTURER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_MANUFACTURER}`)
        await deleteManufacturer(featureName, action)
        break
    default:
        log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
        break
    }
}

async function deleteManufacturer (featureName, action) {
    log.debug(`${SERVICE_NAME}::deleteManufacturer`)
    let manufacturerData = action.data
    log.info(`${SERVICE_NAME}::deleteManufacturer::${action.label}::creating manufacturer from ${JSON.stringify(manufacturerData)}`)
    let responseData = await organisationService.createOrganisation(orgTypes.ORG_TYPE_NAME_MANUFACTURER, manufacturerData)
    log.info(`${SERVICE_NAME}::deleteManufacturer::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::deleteManufacturer, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var manufacturerIdList = localStorage.getItem(featureName, 'manufacturerIdList')
    if (!manufacturerIdList) {
        manufacturerIdList = []
    }
    manufacturerIdList.push(responseData.Id)
    localStorage.setItem(featureName, 'manufacturerIdList', manufacturerIdList)
}

module.exports.process = process