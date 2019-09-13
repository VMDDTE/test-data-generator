const actionTypes = require('../common/constants')
const organisationService = require('../service/organisation-service')
const userService = require('../service/user-service')
const log = global.log

const SERVICE_NAME = 'delete-action-processor'

async function process (featureName, action) {
    log.debug(`${SERVICE_NAME}::${featureName}::process`)
    switch (action.type) {
    case actionTypes.ACTION_TYPE_MANUFACTURER:
    case actionTypes.ACTION_TYPE_WHOLESALER:
    case actionTypes.ACTION_TYPE_MARKETING_AUTHORISATION_HOLDER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_MANUFACTURER}`)
        await deleteManufacturer(featureName, action)
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

async function deleteManufacturer (featureName, action) {
    log.debug(`${SERVICE_NAME}::deleteManufacturer`)
    let manufacturerData = action.data
    log.info(`${SERVICE_NAME}::deleteManufacturer::${action.label}::deleting manufacturer from ${JSON.stringify(manufacturerData)}`)

    return await organisationService.findManufacturerByName(manufacturerData.Name)
    .then((response) => {
        log.info(`${SERVICE_NAME}::deleteManufacturer::${action.label}::found:${JSON.stringify(response)}`)
        organisationService.deleteOrganisation(response.Id)
    })
    .catch(error => {
        log.warn(`${SERVICE_NAME}::deleteManufacturer:error: ${error}`)
    })

}

async function deleteUser (featureName, action) {
    log.debug(`${SERVICE_NAME}::deleteUser`)
    let userData = action.data
    log.info(`${SERVICE_NAME}::deleteUser::${action.label}::deleting user from ${JSON.stringify(userData)}`)

    return await userService.findUserByEmail(userData.Email)
    .then((response) => {
        log.info(`${SERVICE_NAME}::deleteUser::${action.label}::found:${JSON.stringify(response)}`)
        userService.deleteUser(response.Id)
    })
    .catch(error => {
        log.warn(`${SERVICE_NAME}::deleteUser:error: ${error}`)
    })

}

module.exports.process = process