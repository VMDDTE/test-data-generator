const actionTypes = require('../common/constants')
const orgTypes = require('../common/constants')
const organisationService = require('../service/organisation-service')
const userService = require('../service/user-service')
const log = global.log

const SERVICE_NAME = 'delete-action-processor'

async function process (featureName, action) {
    log.debug(`${SERVICE_NAME}::${featureName}::process`)
    switch (action.type) {
    case actionTypes.ACTION_TYPE_MANUFACTURER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_MANUFACTURER}`)
        await deleteOrganisation(orgTypes.ORG_TYPE_NAME_MANUFACTURER, featureName, action)
        break
    case actionTypes.ACTION_TYPE_WHOLESALER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_WHOLESALER}`)
        await deleteOrganisation(orgTypes.ORG_TYPE_NAME_WHOLESALER, featureName, action)
        break
    case actionTypes.ACTION_TYPE_MARKETING_AUTHORISATION_HOLDER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_MARKETING_AUTHORISATION_HOLDER}`)
        await deleteOrganisation(orgTypes.ORG_TYPE_NAME_MARKETING_AUTHORISATION_HOLDER, featureName, action)
        break
    case actionTypes.ACTION_TYPE_USER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_USER}`)
        await deleteUser(featureName, action)
        break
    default:
        log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
        break
    }
}

async function deleteOrganisation (organisationType, featureName, action) {
    log.debug(`${SERVICE_NAME}::deleteOrganisation`)
    let organisationData = action.data
    log.info(`${SERVICE_NAME}::deleteOrganisation::${action.label}::deleting organisation from ${JSON.stringify(organisationData)}`)

    return await organisationService.findOrganisationByName(organisationType, organisationData.Name)
    .then((response) => {
        log.info(`${SERVICE_NAME}::deleteOrganisation::${action.label}::found:${JSON.stringify(response)}`)
        organisationService.deleteOrganisation(response.Id)
    })
    .catch(error => {
        log.warn(`${SERVICE_NAME}::deleteOrganisation:error: ${error}`)
    })

}

async function deleteUser (featureName, action) {
    log.debug(`${SERVICE_NAME}::deleteUser`)
    let userData = action.data
    log.info(`${SERVICE_NAME}::deleteUser::${action.label}::deleting user from ${JSON.stringify(userData)}`)

    var func,parm;
    if (userData.Email){
        func = userService.findUserByEmail
        parm = userData.Email
    }else if (userData.Name){
        func = userService.findUserByName
        parm = userData.Name
    }else{
        log.error(`${SERVICE_NAME}::deleteUser:error: neither name nor email passed in to deleteUser`)
        return
    }
    return await func(parm)
    .then((response) => {
        log.info(`${SERVICE_NAME}::deleteUser::${action.label}::found:${JSON.stringify(response)}`)
        userService.deleteUser(response.Id)
    })
    .catch(error => {
        log.warn(`${SERVICE_NAME}::deleteUser:error: ${error}`)
    })
}

module.exports.process = process
